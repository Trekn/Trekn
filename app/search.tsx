import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button as RNButton,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { calculateDistance } from '../functions/calculateDistance';
import { supabase } from '../utils/supabaseClients';
import ListDetail from '../components/ListDetail';
import {
  setStorageItemAsync,
  useStorageState,
} from '../functions/useStorageState';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const Search = () => {
  const [value, setValue] = useState('');
  const user = useSelector((state: any) => state.user);
  const histories = JSON.parse(useStorageState('search-history')[0][1] || '[]');
  const type = useSelector((state: any) => state.config?.dropType);
  const [visibleItems, setVisibleItems] = useState(4);
  const [selectedPopular, setSelectedPopolar] = useState(-1);
  const [listSearch, setListSearch] = useState([]);
  const [status, setStatus] = useState('Beginning');
  const [loadingSearching, setLoadingSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  useEffect(() => {
    // Handle any side effect or initial setup here
  }, []);

  const handleViewMore = () => {
    setVisibleItems((prev) => prev + 3);
  };

  const handleSearch = async (selectedType?: any) => {
    setLoadingSearching(true);
    setStatus('HaveResult');
    setListSearch([]);

    const searchTerms = value.split(' ');
    const searchInput =
      searchTerms.length === 1
        ? searchTerms[0]
        : `'${searchTerms.join("' & '")}'`;
    console.log(2);

    try {
      let _data: any;
      if (selectedType) {
        setValue(selectedType.type);
        const { data, error } = await supabase
          .from('drop')
          .select('*, user(*)')
          .eq('type', selectedType.id);
        _data = data;
        console.log(3);
        if (error) throw error;
      } else {
        console.log(4);
        console.log(value, histories);

        setStorageItemAsync(
          'search-history',
          JSON.stringify([value, ...histories])
        );

        const { data, error } = await supabase
          .from('drop')
          .select('*, user(*)')
          .textSearch('name', searchInput);
        _data = data;
        console.log(5);
        if (error) throw error;
      }

      if (_data.length > 0) {
        let nearBy: any = [];
        nearBy.push(
          ..._data.map((item: any) => ({
            ...item,
            distance: calculateDistance(user.lat, user.lng, item.lat, item.lng),
          }))
        );
        nearBy.sort((a: any, b: any) => a.distance - b.distance);
        setListSearch(nearBy);
      } else {
        setStatus('DontHave');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setLoadingSearching(false);
  };

  const handleScroll = (event: any) => {
    const windowHeight = event.nativeEvent.layoutMeasurement.height;
    const documentHeight = event.nativeEvent.contentSize.height;
    const scrollTop = event.nativeEvent.contentOffset.y;
    if (windowHeight + scrollTop >= documentHeight - 10) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
  };

  return (
    <View
      style={{
        marginTop: '10%',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: 51,
          padding: 15,
          marginHorizontal: 20,
          marginBottom: 24,
          backgroundColor: '#F5F5F5',
          borderRadius: 10,
        }}
      >
        <TextInput
          value={value}
          onChangeText={(text) => {
            if (!text) {
              setStatus('Beginning');
            } else {
              setValue(text);
            }
          }}
          placeholderTextColor={'#0B080880'}
          placeholder='Search for an IRL experience...'
          style={{
            color: 'black',
            flex: 1,
          }}
          onSubmitEditing={async () => {
            if (value !== '') {
              handleSearch();
            } else {
              setStatus('Beginning');
            }
            setLoadingSearching(false);
          }}
        />
        {value && (
          <TouchableOpacity
            onPress={() => {
              setValue('');
              setStatus('Beginning');
            }}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </TouchableOpacity>
        )}
      </View>

      {status === 'Beginning' && histories && histories.length > 0 && (
        <View style={{ width: '100%', opacity: 0.8, padding: 15 }}>
          {histories.length > 0 && histories.length <= 3 ? (
            <>
              {histories.map((item: any, index: any) => (
                <View key={index}>
                  <Text
                    onPress={() => {
                      setValue(item);
                    }}
                    style={{
                      color: '#0B0808',
                      fontWeight: '500',
                      fontSize: 16,
                    }}
                  >
                    {item}
                  </Text>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#F5F5F5',
                      marginVertical: 16,
                    }}
                  ></View>
                </View>
              ))}
            </>
          ) : (
            <>
              <ScrollView style={{ maxHeight: 196 }}>
                {histories
                  ?.slice(0, visibleItems)
                  .map((item: any, index: any) => (
                    <TouchableOpacity
                      onPress={() => {
                        setValue(item);
                        setSelectedPopolar(-1);
                      }}
                      key={index}
                    >
                      <Text
                        style={{
                          color: '#0B0808',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}
                      >
                        {item}
                      </Text>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: '#F5F5F5',
                          marginVertical: 16,
                        }}
                      ></View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              <View style={{ alignItems: 'center' }}>
                <RNButton title='View more' onPress={handleViewMore} />
              </View>
            </>
          )}
        </View>
      )}

      {status === 'Beginning' ? (
        <>
          <View style={{ height: 8, backgroundColor: '#F5F5F5' }}></View>
          <View style={{ marginLeft: 20, marginTop: 24, width: '100%' }}>
            <Text
              style={{
                marginBottom: 24,
                color: '#0B0808',
                fontWeight: '500',
                fontSize: 16,
              }}
            >
              Popular
            </Text>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', opacity: 0.8 }}
            >
              {type?.slice(0, 3).map((item: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (selectedPopular !== -1 && selectedPopular === index) {
                      setSelectedPopolar(-1);
                      setValue('');
                    } else {
                      setSelectedPopolar(index);
                      handleSearch(item);
                    }
                  }}
                  style={{
                    padding: 15,
                    borderColor: '#000000B2',
                    borderWidth: 1,
                    borderRadius: 20,
                    margin: 4,
                  }}
                >
                  <Text>{item.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          <ScrollView scrollEventThrottle={16} onScroll={handleScroll}>
            <View
              style={{
                marginHorizontal: 20,
                marginBottom: 50,
              }}
            >
              {status === 'HaveResult' ? (
                <>
                  {loadingSearching ? (
                    <Text>Loading result</Text>
                  ) : (
                    <>
                      <ListDetail
                        status={'Nearby'}
                        data={listSearch}
                        isEnd={isEnd}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  {!loadingSearching && (
                    <View
                      style={{
                        height: Dimensions.get('screen').height - 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 16,
                      }}
                    >
                      <Image
                        source={require('../assets/old-image/Route_search.svg')}
                        style={{
                          height: 233,
                          width: 233,
                        }}
                      />
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 16,
                          fontWeight: '500',
                          marginBottom: 8,
                        }}
                      >
                        No Results Found
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 15,
                          color: 'black',
                          opacity: 50,
                          paddingHorizontal: 32,
                        }}
                      >
                        Couldn't find what you were looking for? If you're at an
                        interesting place, consider adding it to help others
                        discover it too!
                      </Text>
                      <TouchableOpacity
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          rowGap: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 24,
                          backgroundColor: 'black',
                          width: '100%',
                          marginTop: 24,
                          paddingVertical: 12,
                        }}
                        onPress={async () => {
                          if (user.id) {
                            //   navigation.navigate('/check-in/upload-image');
                            router.replace('/check-in/upload-image');
                          } else {
                            setLoading(true);
                            //   await init();
                            setLoading(false);
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          color='white'
                          size={24}
                        />
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 16,
                            fontWeight: '600',
                          }}
                        >
                          Add a new place
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Search;
