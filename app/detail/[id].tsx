import { faCirclePlus, faFaceFrown, faFaceKissWinkHeart, faFaceLaughBeam, faFaceMeh, faFaceSadCry, faLocationArrow, faMapPin, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity, ScrollView, Text, View } from 'react-native'
import { useSelector } from 'react-redux';
import useAutoPlay from '../../hooks/useAutoplay';
import { getDropByID } from '../../middleware/data/drop';
import { calculateDistance } from '../../functions/calculateDistance';
import CustomCarousel from '../../components/carousel/Carousel';
import { G, Mask, Path, Rect, Svg } from 'react-native-svg';
import moment from 'moment';
import { getScore } from '../../utils/account.util';
import { formatLocation } from '../../functions/text';
import { Image } from 'expo-image';
import MapView, { Marker } from 'react-native-maps';
import LoadingSpinner from '../../components/LoadingSpinner';

const reactions = [
  {
    icon: <FontAwesomeIcon icon={faFaceSadCry} size={24} />,
  },
  {
    icon: <FontAwesomeIcon icon={faFaceFrown} size={24} />,
  },
  {
    icon: <FontAwesomeIcon icon={faFaceMeh} size={24} />,
  },

  {
    icon: <FontAwesomeIcon icon={faFaceLaughBeam} size={24} />,
  },
  {
    icon: <FontAwesomeIcon icon={faFaceKissWinkHeart} size={24} />,
  },
];

export default function Details() {
  const { id } = useLocalSearchParams();
  const user = useSelector((state: any) => state.user);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mintStatus, setMintStatus] = useState('');
  const [disable, setDisable] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [userChecked, setUserChecked] = useState<any>([]);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(false);
  // const webcamRef = useRef(null);
  // const videoRef: any = useRef();
  // useAutoPlay(videoRef);

  useEffect(() => {
    (async () => {
      if (id) {
        setLoading(true);
        const data: any = await getDropByID({ dropId: id });
        setSelectedLocation(data[0]);

        const distance = Math.ceil(
          calculateDistance(user.lat, user.lng, data[0].lat, data[0].lng)
        );

        setUserChecked(data[0].minted);

        if (!user.id) {
          setMintStatus('Login to Collect');
          setDisable(false);
        } else {
          let minted = false;
          if (data[0].minted.length >= 0) {
            for (let user_mint of data[0].minted) {
              if (user_mint.user.id === user.id) {
                minted = true;
              }
            }
          }

          if (minted) {
            setDisable(true);
            setMintStatus('Collected');
          } else {
            if (!data[0].radius || distance <= data[0].radius) {
              setDisable(false);
              setMintStatus('Collect');
            } else {
              setDisable(true);
              setMintStatus('Move closer to collect');
            }
          }
        }
        setLoading(false);
      }
    })()
  }, [user]);
  return (
    <>
      {loading && !selectedLocation ?
        <LoadingSpinner />
        :
        <ScrollView
          style={{
            // marginBottom: 20
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: 20
            }}
          >
            <TouchableOpacity onPress={() => { router.replace('/') }}>
              <Svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                style={{ marginBottom: 24 }}
              >
                <Path
                  d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
                  fill='black'
                  fillOpacity='0.7'
                />
              </Svg>
            </TouchableOpacity>
            {selectedLocation && (
              <>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24
                  }}>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        columnGap: 8
                      }}
                    >
                      <Image
                        source={selectedLocation.user.profileImage || selectedLocation.user.profile_image}
                        style={{
                          borderRadius: 999,
                          width: 40,
                          height: 40,
                          objectFit: 'cover',

                        }}
                      />
                      <View>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '500',
                            lineHeight: 16,
                            marginBottom: 8
                          }}>
                          {selectedLocation.user.name}
                        </Text>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            columnGap: 4,
                          }}>
                          <FontAwesomeIcon icon={faCirclePlus} size={12} />
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: '500',
                              lineHeight: 16,
                              color: '#02030380'
                            }}>
                            {moment(selectedLocation.created_at).format(
                              'Do MMM, h:mm A'
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '600',
                        lineHeight: 28,
                        letterSpacing: -0.08
                      }}>
                      {selectedLocation.name}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        columnGap: 8
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          columnGap: 4
                        }}>
                        <FontAwesomeIcon icon={faThumbsUp} size={16} color='#FFB800' />
                        <Text
                          style={{
                            color: `${selectedLocation &&
                              Number(getScore(selectedLocation, false))
                              ? '#000000b3'
                              : '#02030380'
                              }`,
                            fontWeight: '500',
                            lineHeight: 20
                          }}
                          numberOfLines={1}
                        >
                          {selectedLocation && getScore(selectedLocation, true)}
                        </Text>
                      </View>
                      <View
                        style={{
                          borderRadius: 999,
                          backgroundColor: '#dfdfdf70',
                          width: 8,
                          height: 8
                        }}
                      ></View>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 13,
                          color: '#02030380',
                          lineHeight: 16
                        }}
                        numberOfLines={1}>
                        {selectedLocation.location_name}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        height: 335,
                        marginBottom: 16
                      }}
                    >
                      {selectedLocation.imageArray ? (
                        <CustomCarousel data={selectedLocation} />
                      ) : (
                        <Image
                          source={{ uri: selectedLocation.image }}
                          alt=''
                          style={{
                            borderRadius: 999,
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                    </View>
                    {selectedLocation.description &&
                      <Text
                        style={{
                          fontWeight: '500',
                          fontSize: 15,
                          lineHeight: 24,
                          paddingHorizontal: 8,
                          color: '#02030380'
                        }}
                      >
                        {selectedLocation.description}
                      </Text>
                    }
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#EBEBEB',
                        marginTop: 20
                      }}
                    ></View>
                  </View>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 16
                      }}
                    >
                      Location
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '500',
                        lineHeight: 16,
                        color: '#02030380',
                        marginBottom: 16
                      }}
                    >
                      {formatLocation(selectedLocation.location)}
                    </Text>
                    <View
                      style={{
                        height: 200,
                        borderRadius: 12,
                        position: 'relative',
                        marginBottom: 16,
                        overflow: 'hidden'
                      }}
                    >
                      <MapView
                        initialRegion={{
                          latitude: selectedLocation.lat,
                          longitude: selectedLocation.lng,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                        minZoomLevel={15}
                        style={{
                          height: 200,
                        }}
                      >
                        <Marker
                          coordinate={{ longitude: selectedLocation.lng, latitude: selectedLocation.lat }}
                        >
                          <FontAwesomeIcon icon={faMapPin} size={24} color='#278EFF' />
                        </Marker>
                        <View
                          style={{
                            position: 'absolute',
                            right: 8,
                            bottom: 8,
                            width: 32,
                            height: 32,
                            borderRadius: 999,
                            backgroundColor: 'black',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{color: 'white'}}>aaa</Text>
                          <FontAwesomeIcon icon={faLocationArrow} size={16} color='#fff' />
                        </View>
                      </MapView>
                    </View>
                    <View
                      style={{
                        borderBottomColor: '#EBEBEB',
                        borderBottomWidth: 1
                      }}></View>
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 20,
                      fontWeight: 'bold'
                    }}>
                    Other check-ins
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                    {userChecked && userChecked.length > 0 ? (
                      userChecked.map((minted: any, idx: number) => (
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            columnGap: 12
                          }}
                          key={idx}>
                          <Image
                            source={minted.user.profile_image || minted.user.profileImage}
                            alt='main user'
                            style={{
                              borderRadius: 999,
                              width: 48,
                              height: 48
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '500'
                            }}>
                            {minted.user.name}
                          </Text>
                          <Text
                            style={{
                              borderRadius: 999,
                              backgroundColor: '#F5F5F5',
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              fontSize: 13,
                              color: '#828282',
                              fontWeight: '500'
                            }}>
                            {minted.user.address.slice(0, 2)}...
                            {minted.user.address.slice(-6, -1)}
                          </Text>
                          {minted?.reaction_id && (
                            <View>{reactions[minted?.reaction?.kind].icon}</View>
                          )}
                        </View>
                      ))
                    ) : (
                      <View
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                          backgroundColor: '#F5F5F5',
                          borderRadius: 8,
                          width: '100%',
                          marginHorizontal: 'auto',
                          paddingVertical: 27
                        }}>
                        <Image
                          source={require('../../assets/old-image/traveler.png')}
                          contentFit='cover'
                          style={{
                            width: 66,
                            height: 101
                          }} />
                        <Text
                          style={{
                            textAlign: 'center',
                            fontWeight: '500',
                            fontSize: 13,
                            lineHeight: 20,
                            color: '#828282',
                            maxWidth: 205
                          }}
                        >Go to this place and be the first one checked in here</Text>
                      </View>
                    )}
                  </View>

                  {/* <Button
              className='h-12 rounded-3xl text-white bg-black'
              style={{ width: windowSize.width - 40 }}
              loading={loading}
              onClick={async () => {
                setOpenDrawer(true);
              }}
              disabled={disable}
            >
              {mintStatus}
            </Button> */}
                </View>
              </>
            )}

            {/* <CustomWebcam /> */}
          </View >
        </ScrollView>
      }
    </>
  )
}
