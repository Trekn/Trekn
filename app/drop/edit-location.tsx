import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Circle, Path, Svg } from 'react-native-svg';
import useApi from '@/hooks/useAPI';
import { useAuthContext } from '@/context/AuthContext';
import provinceList from '@/constants/country.json';
import { router } from 'expo-router';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomiseInputWIco from '@/components/CustomiseInputWIco';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronCircleRight,
  faMapPin,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { capitalizeFirstLetter } from '@/functions/text';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function EditLocation() {
  const { setMetadata, metadata } = useAuthContext();
  const apiService = useApi();
  const user = useSelector((state: any) => state.user);
  const [currentEdit, setCurrentEdit] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [address, setAddress] = useState<string>('');
  const [addressProperties, setAddressProperties] = useState<any>(null);
  const [addressForm, setAddressForm] = useState<{
    state?: string;
    city?: string;
    district?: string;
    subDistrict?: string;
  }>({});
  const [dataList, setDataList] = useState<Array<any>>([]);
  const [citiesOfState, setCitiesOfState] = useState([]);
  const [filteredDataList, setFilteredDataList] = useState<Array<any>>([]);
  const [currentCode, setCurrentCode] = useState(null);
  const [addressLocation, setAddressLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  console.log('Edit location', metadata);

  const stepList =
    user.country === 'Vietnam'
      ? ['cities', 'district', 'subDistrict']
      : ['state', 'cities'];

  const handleFilterLocation = (value: string) => {
    setSearchValue(value);
    if (currentEdit === 'address') {
      fetchSuggestAddress(value);
      setLoading(true);
    } else {
      const result = value
        ? dataList.filter((location: any) =>
            location.name.toLowerCase().includes(value)
          )
        : dataList;
      setFilteredDataList(result);
    }
  };

  const fetchSuggestAddress = useDebouncedCallback(async (value: any) => {
    let subValue = '';
    setLoading(true);
    Object.entries(addressForm)
      .reverse()
      .map(([_, value]) => {
        subValue += ` ${value},`;
      });

    const { items }: any = await apiService.get(
      `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${user.lat},${
        user.lng
      }&limit=3&lang=en&q=${`${value} ${subValue}`}&apiKey=${
        process.env.EXPO_PUBLIC_HERE_API_KEY
      }`
    );
    setFilteredDataList(items);
    setLoading(false);
  }, 1000);
  useEffect(() => {
    setLoading(true);
    (async () => {
      let data: any;
      if (user.country === 'Vietnam') {
        switch (currentEdit) {
          case 'cities':
            data = await apiService.get(
              'https://vn-provinces-one.vercel.app/api/p/'
            );
            break;
          case 'district':
            const p: any = await apiService.get(
              `https://vn-provinces-one.vercel.app/api/p/${currentCode}?depth=2`
            );
            data = p.districts;
            break;
          case 'subDistrict':
            const d: any = await apiService.get(
              `https://vn-provinces-one.vercel.app/api/d/${currentCode}?depth=2`
            );
            data = d.wards;
            break;
          default:
        }
      } else {
        switch (currentEdit) {
          case 'state':
            const stateList = (provinceList as any).filter(
              (province: any) => province.name === user.country
            )[0]?.states;
            data = stateList;
            break;
          case 'cities':
            data = citiesOfState;
            break;
          default:
        }
      }
      setDataList(data);
      setFilteredDataList(data);
      setLoading(false);
    })();
  }, [currentEdit]);

  const handleReturn = () => {
    setCurrentEdit('');
    setSearchValue('');
    setMetadata({});
  };

  const handleChoose = (item: any) => {
    const currentStepIdx = stepList.indexOf(currentEdit);
    setAddressForm((prev) => ({
      ...prev,
      [currentEdit === 'cities' ? 'city' : currentEdit]: item.name || item,
    }));
    if (user.country !== 'Vietnam') {
      setCitiesOfState(item.cities);
    }
    setCurrentCode(item.code);
    setDataList([]);
    setFilteredDataList([]);
    setSearchValue('');
    setCurrentEdit(stepList[currentStepIdx + 1]);
  };

  const handleChangeAddress = (key: string) => {
    switch (key) {
      case 'city':
        user.country === 'Vietnam'
          ? setAddressForm({})
          : setAddressForm((prev) => {
              const newForm = { ...prev };
              delete newForm.city;
              return newForm;
            });
        setCurrentEdit('cities');
        break;
      case 'state':
        setAddressForm({});
        setCurrentEdit(key);
        break;
      default:
        setAddressForm((prev) => {
          const newForm: any = { ...prev };
          delete newForm[key];
          return newForm;
        });
        setCurrentEdit(key);
    }
    // setAddressForm({});
    // setCurrentEdit('cities');
  };

  const handleConfirmAddress = async (item?: any) => {
    if (item) {
      setAddressLocation({
        lng: item.position.lng,
        lat: item.position.lat,
        label: item.address.label,
      });
    } else {
      const locationInfo: any = await apiService.get(
        `https://nominatim.openstreetmap.org/search.php?q=${
          addressForm.subDistrict
            ? `${addressForm.subDistrict} ${addressForm.district}`
            : `${addressForm.city} ${addressForm.state}`
        }&polygon_geojson=1&format=jsonv2`
      );
      setAddressLocation({
        label: searchValue,
        lng: locationInfo[0].lon,
        lat: locationInfo[0].lat,
      });
    }
    setCurrentEdit('confirm');
  };

  useEffect(() => {
    (async () => {
      try {
        setLocationLoading(true);
        // const response = await axios.get(
        //   `https://api.geoapify.com/v1/geocode/reverse?lat=${user.lat}&lon=${user.lng}&apiKey=${process.env.REACT_APP_GEOAPIFY}`
        // );
        const { data: newReverse } = await axios.get(
          `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${user.lat},${user.lng}&apiKey=68EoUSty8tADbG5alGwihFJqUp6lUrr_DsAy1CWTq5s`
        );
        console.log(newReverse.items[0]);
        setAddressProperties(newReverse.items[0]?.address);
        setAddress(newReverse.items[0]?.title);
        setLocationLoading(false);
      } catch (error) {
        console.error('Error fetching address: ', error);
      }
    })();
  }, []);

  const onMapMove = useCallback(async (event: any) => {
    setAddressLocation((prev: any) => ({
      ...prev,
      lng: event.viewState.longitude,
      lat: event.viewState.latitude,
    }));
  }, []);

  const handleSubmit = () => {
    setMetadata({
      ...metadata,
      location: addressLocation.label,
      location_name: addressLocation.label,
      lat: addressLocation.lat,
      lng: addressLocation.lng,
    });
    router.replace('/drop/enter-info');
  };

  const isHaveLocation = () => {
    return user.lat &&
      user.lng &&
      address &&
      addressProperties?.district &&
      addressProperties?.city &&
      addressProperties?.houseNumber &&
      addressProperties?.street
      ? true
      : false;
  };

  const selectedState = () => (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 16,
        paddingHorizontal: 8,
        rowGap: 16,
      }}
    >
      {Object.entries(addressForm).map(([key, value]: any, idx: number) => (
        <TouchableHighlight key={idx} onPress={() => handleChangeAddress(key)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 4,
            }}
          >
            <Svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <Circle cx='10' cy='10' r='10' fill='#99FF48' fillOpacity='0.4' />
              <Circle cx='10' cy='10' r='6' fill='#99FF48' />
            </Svg>
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '500',
                lineHeight: 16 * (120 / 100),
              }}
            >
              {value}
            </Text>
          </View>
        </TouchableHighlight>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      style={{
        padding: 16,
        position: 'relative',
        backgroundColor: 'black',
        height: Dimensions.get('screen').height,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
          marginBottom: 24,
        }}
      >
        <Pressable
          style={{
            position: 'absolute',
            top: 13,
            zIndex: 50,
          }}
          onPress={() =>
            currentEdit ? handleReturn() : router.replace('/drop/add-post')
          }
        >
          <Svg width='17' height='16' viewBox='0 0 17 16' fill='none'>
            <Path
              d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
              fill='#FFFFFFB2'
              fillOpacity='0.7'
            />
          </Svg>
        </Pressable>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 40,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            width: Dimensions.get('screen').width - 40,
          }}
        >
          Edit location address
        </Text>
      </View>
      {locationLoading ? (
        <LoadingSpinner />
      ) : (
        // <Spin spinning={locationLoading} className='edit-location w-full h-80 flex flex-col justify-center items-center' />
        <>
          {!currentEdit && (
            <>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: '#FFFFFF70',
                    lineHeight: 13 * (120 / 100),
                  }}
                >
                  Location address
                </Text>
                <Pressable
                  style={{
                    backgroundColor: '#33333387',
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    columnGap: 12,
                  }}
                  // className='text-base font-semibold leading-[120%]'
                  onPress={() =>
                    Object.entries(addressForm)?.length > 0
                      ? handleChangeAddress(
                          user.country === 'Vietnam' ? 'cities' : 'state'
                        )
                      : setCurrentEdit(
                          user.country === 'Vietnam' ? 'cities' : 'state'
                        )
                  }
                >
                  {Object.entries(addressForm)?.length > 0 ? (
                    selectedState()
                  ) : addressProperties?.district &&
                    addressProperties?.city &&
                    addressProperties.county ? (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        lineHeight: 16 * (120 / 100),
                        color: 'white',
                        maxWidth: 300
                      }}
                      numberOfLines={1}
                    >
                      {addressProperties.district}, {addressProperties.city},{' '}
                      {addressProperties.county}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: '#ffffff50',
                        fontSize: 16,
                        fontWeight: '600',
                        lineHeight: 16 * (120 / 100),
                      }}
                      numberOfLines={1}
                    >
                      {user.country === 'Vietnam'
                        ? 'Quận/Huyện, Phường/Xã'
                        : 'State'}
                    </Text>
                  )}
                  <FontAwesomeIcon
                    icon={faChevronCircleRight}
                    size={16}
                    color='#ffffff70'
                  />
                </Pressable>
                <Pressable
                  style={{
                    borderRadius: 12,
                    backgroundColor: '#33333387',
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                  }}
                  onPress={() => setCurrentEdit('address')}
                >
                  {addressProperties?.houseNumber &&
                  addressProperties?.street ? (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        lineHeight: 16 * (120 / 100),
                        color: 'white',
                      }}
                    >
                      {addressProperties.name && `${addressProperties.name}, `}
                      {addressProperties.houseNumber} {addressProperties.street}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        lineHeight: 16 * (120 / 100),
                        color: '#ffffff50',
                      }}
                    >
                      {user.country === 'Vietnam'
                        ? 'Tên đường, Tòa nhà, Số nhà'
                        : 'Address'}
                    </Text>
                  )}
                </Pressable>
              </View>
              {isHaveLocation() && (
                <Pressable
                  style={{
                    marginTop: 'auto',
                    backgroundColor: '#99FF48',
                    paddingVertical: 12,
                    borderRadius: 24
                  }}
                  onPress={() => {
                    setMetadata({
                      ...metadata,
                      location: address,
                      location_name: address,
                      lat: user.lat,
                      lng: user.lng,
                    });
                    router.replace('/drop/enter-info');
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: '600',
                      lineHeight: 18,
                      textAlign: 'center'
                    }}
                  >
                    Use my current location
                  </Text>
                </Pressable>
              )}
            </>
          )}

          {currentEdit && (
            <>
              {currentEdit !== 'confirm' && (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: Object.keys(addressForm)?.length ? 19 : 24,
                  }}
                >
                  <CustomiseInputWIco
                    style={'dark'}
                    value={searchValue}
                    onChange={handleFilterLocation}
                    label={null}
                    placeholder={
                      currentEdit === 'address'
                        ? user.country === 'Vietnam'
                          ? 'Tên đường, Tòa nhà, Số nhà'
                          : 'Address'
                        : user.country === 'Vietnam'
                        ? 'Quận/Huyện, Phường/Xã'
                        : 'State'
                    }
                    leftIco={
                      currentEdit !== 'address' && (
                        <FontAwesomeIcon
                          icon={faSearch}
                          size={16}
                          color='#ffffff70'
                        />
                      )
                    }
                  />
                  <>
                    {currentEdit !== 'address' &&
                      Object.entries(addressForm)?.length > 0 &&
                      selectedState()}
                    <View
                      style={{
                        paddingHorizontal: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '500',
                          color: '#FFFFFF70',
                          lineHeight: 13 * (120 / 100),
                          marginBottom: 24,
                        }}
                      >
                        {capitalizeFirstLetter(currentEdit)}
                      </Text>
                      {loading ? (
                        <LoadingSpinner />
                      ) : (
                        // <Spin spinning={loading} className='edit-location w-full h-80 flex flex-col justify-center items-center' />
                        <ScrollView>
                          {filteredDataList?.length > 0 &&
                            filteredDataList.map((item, idx) => (
                              <View key={idx}>
                                <Pressable
                                  onPress={() =>
                                    currentEdit !== 'address'
                                      ? handleChoose(item)
                                      : handleConfirmAddress(item)
                                  }
                                >
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      fontWeight: '500',
                                      color: 'white',
                                      lineHeight: 16 * (120 / 100),
                                    }}
                                    // className='text-base text-white font-medium leading-[120%]'
                                  >
                                    {item.name || item.title || item}
                                  </Text>
                                </Pressable>
                                {idx + 1 !== filteredDataList.length && (
                                  <View
                                    style={{
                                      marginVertical: 16,
                                      height: 1,
                                      backgroundColor: '#626262',
                                    }}
                                  />
                                )}
                              </View>
                            ))}
                        </ScrollView>
                      )}
                    </View>
                  </>
                </View>
              )}
              {currentEdit === 'address' && searchValue && (
                <TouchableHighlight
                  style={{
                    width: '100%',
                    backgroundColor: loading ? '#ccc' : '#2C2C2C',
                    pointerEvents: loading ? 'none' : 'auto',
                    position: 'absolute',
                    bottom: 80,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginLeft: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                  }}
                  disabled={loading}
                  onPress={() => handleConfirmAddress()}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Confirm
                  </Text>
                  {/* {loading ? <Spin /> : 'Confirm'} */}
                </TouchableHighlight>
              )}
              {currentEdit === 'confirm' && (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 60,
                    bottom: 50,
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      top: 11,
                      left: 20,
                      right: 20,
                      backgroundColor: 'white',
                      paddingHorizontal: 12,
                      paddingVertical: 16,
                      zIndex: 50,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#00000050',
                        lineHeight: 13 * (120 / 100),
                        fontWeight: '500',
                      }}
                    >
                      Location address
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#353535',
                        lineHeight: 13 * (120 / 100),
                        fontWeight: '600',
                        paddingHorizontal: 4,
                      }}
                    >
                      {addressLocation.label}
                    </Text>
                  </View>
                  <TouchableHighlight
                    style={{
                      position: 'absolute',
                      backgroundColor: '#2C2C2C',
                      bottom: 20,
                      left: 20,
                      right: 20,
                      paddingVertical: 12,
                      borderRadius: 24,
                      zIndex: 50,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleSubmit()}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      Confirm
                    </Text>
                  </TouchableHighlight>
                  <MapView
                    initialRegion={{
                      latitude: addressLocation.lat,
                      longitude: addressLocation.lng,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    minZoomLevel={15}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    onRegionChange={(region) => {
                      const { latitude: lat, longitude: lng } = region;
                      setAddressLocation((prev: any) => ({
                        ...prev,
                        lat,
                        lng,
                      }));
                    }}
                  >
                    <Marker
                      coordinate={{
                        longitude: addressLocation.lng,
                        latitude: addressLocation.lat,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMapPin}
                        size={24}
                        color='#278EFF'
                      />
                    </Marker>
                  </MapView>
                </View>
              )}
            </>
          )}
        </>
      )}
      <StatusBar style='light'/>
    </SafeAreaView>
  );
}
