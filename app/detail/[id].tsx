import { faClose, faFaceFrown, faFaceKissWinkHeart, faFaceLaughBeam, faFaceMeh, faFaceSadCry, faMapPin, faShare, faThumbsUp, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, ScrollView, Text, View, Dimensions } from 'react-native'
import { useSelector } from 'react-redux';
import { getDropByID } from '../../middleware/data/drop';
import { calculateDistance } from '../../functions/calculateDistance';
import CustomCarousel from '../../components/carousel/Carousel';
import { Path, Svg } from 'react-native-svg';
import { getScore } from '../../utils/account.util';
import { capitalizeFirstLetter, formatLocation } from '../../functions/text';
import { Image } from 'expo-image';
import MapView, { Marker } from 'react-native-maps';
import LoadingSpinner from '../../components/LoadingSpinner';
import Constants from 'expo-constants';
import Line from '@/components/drop/Line';
import Voting from '@/components/voting/Voting';
import Validating from '@/components/voting/Validating';
import VotingButton from '@/components/voting/VotingButton';
import CustomDrawer from '@/components/CustomDrawer';
import { voteDrop } from '@/middleware/data/voting';

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
  const typeList = useSelector((state: any) => state.config?.dropType);
  const user = useSelector((state: any) => state.user);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [isVoted, setIsVoted] = useState(false);

  const checkValidate = () => {
    // if (user.id === selectedLocation?.user?.id) {
    //   return false
    // } else {
    const date = new Date(selectedLocation?.created_at);
    const currentDate = new Date();
    date.setDate(date.getDate() + 1);
    return currentDate <= date;
    // }
  }

  const handleVote = async (type: string) => {
    const votingId = selectedLocation?.voting?.id;
    const userId = user.id;
    const votingResult = await voteDrop({ type, votingId, user: userId });
    setSelectedLocation((prev: any) => ({ ...prev, voting: { ...prev?.voting, voting_data: [...prev?.voting?.voting_data, votingResult] } }));
    setIsVoted(true);
  }

  useEffect(() => {
    (async () => {
      if (id) {
        setLoading(true);
        const data: any = await getDropByID({ dropId: id });
        setSelectedLocation(data);

        const isVoted = data?.voting?.voting_data.some((voteItem: any) => {
          return voteItem?.user === user.id
        })
        setIsVoted(isVoted && data?.voting?.type === 'voting')
        const distance = Math.ceil(
          calculateDistance(user.lat, user.lng, data.lat, data.lng)
        );
        setLoading(false);
      }
    })()
  }, [user]);
  return (
    <>
      {loading && !selectedLocation ?
        <LoadingSpinner />
        :
        <>
          <ScrollView>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <TouchableOpacity
                onPress={() => { router.replace('/map') }}
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  top: Constants.statusBarHeight + 12,
                  left: 16,
                  zIndex: 100,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 999
                }}
              >
                <Svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                >
                  <Path
                    d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
                    fill='black'
                    fillOpacity='0.7'
                  />
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { router.replace('/map') }}
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  top: Constants.statusBarHeight + 12,
                  right: 16,
                  zIndex: 100,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 999
                }}
              >
                <FontAwesomeIcon icon={faShare} color='black' />
              </TouchableOpacity>
              {selectedLocation && (
                <ScrollView>
                  <View style={{ position: 'relative', height: 423, width: '100%' }}>
                    {selectedLocation?.drop?.imageArray || selectedLocation?.imageArray ?
                      <CustomCarousel data={selectedLocation} fullWidth style={{ borderRadius: 0 }} />
                      :
                      <Image
                        source={{ uri: selectedLocation?.image || selectedLocation?.drop?.image }}
                        alt='Drop Img'
                        style={{
                          height: '100%',
                          width: '100%'
                        }}
                      />
                    }
                  </View>
                  <View style={{ marginHorizontal: 20, marginVertical: 24 }}>
                    <View>
                      {selectedLocation?.type &&
                        <Text
                          style={{
                            fontSize: 13,
                            lineHeight: 24,
                            color: '#00000050',
                            fontWeight: '500'
                          }}
                        >{capitalizeFirstLetter(typeList[selectedLocation?.type]?.type)}</Text>
                      }
                      <Text style={{ fontWeight: '600', fontSize: 20, lineHeight: 36, color: 'black' }}>
                        {selectedLocation?.name}
                      </Text>
                      {selectedLocation?.reaction?.length > 0 || selectedLocation.location &&
                        <View style={{ display: 'flex', flexDirection: 'row', columnGap: 8, alignItems: 'center', marginTop: 12 }}>
                          {
                            selectedLocation?.reaction?.length > 0 &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 4 }}>
                              <FontAwesomeIcon color='#000000' size={16} icon={faThumbsUp} />
                              <Text style={{ color: 'black', opacity: selectedLocation?.reaction?.length > 0 ? 1 : 0.7, fontSize: 14, lineHeight: 20 }}>{getScore(selectedLocation, true)}</Text>
                            </View>
                          }
                          {selectedLocation.location &&
                            <>
                              <View
                                style={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: 999,
                                  backgroundColor: 'black'
                                }}
                              />
                              <Text
                                style={{
                                  lineHeight: 16,
                                  color: '#02030380',
                                  fontWeight: '500',
                                  fontSize: 13
                                }}>
                                {formatLocation(selectedLocation.location)}
                              </Text>
                            </>
                          }
                        </View>
                      }
                    </View>
                    <View
                      style={{
                        backgroundColor: '#F4F4F4',
                        paddingHorizontal: 16,
                        paddingVertical: 24,
                        borderRadius: 12,
                        marginTop: 24
                      }}
                    >
                      {
                        // selectedLocation?.voting?.type === 'voting' ?
                        checkValidate() ?
                          <Voting dropData={selectedLocation} />
                          :
                          <Validating />
                      }
                    </View>
                    {selectedLocation?.description &&
                      <>
                        <Line />
                        <Text
                          style={{
                            fontSize: 15,
                            lineHeight: 24,
                            color: '#02030390'
                          }}
                        >
                          {selectedLocation?.description}
                        </Text>
                      </>
                    }
                    <Line />
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
                        </MapView>
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
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Image source={require('../../assets/icon/map-arrow.png')} style={{
                            width: 16,
                            height: 16
                          }} />
                        </View>
                      </View>
                    </View>
                    <Line />
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
                        flexDirection: 'column',
                        rowGap: 16,
                        marginTop: 24
                      }}>
                      {selectedLocation?.minted && selectedLocation?.minted?.length > 0 ? (
                        selectedLocation?.minted?.map((minted: any, idx: number) => (
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              columnGap: 12
                            }}
                            key={idx}>
                            <Image
                              source={{ uri: minted?.user.profile_image || minted?.user.profileImage }}
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
                  </View>
                </ScrollView>
              )}
            </View >
          </ScrollView>
          {/* TODO: Voting BE */}
          {!isVoted &&
            <View
              style={{
                paddingTop: 16,
                paddingBottom: 46,
                paddingHorizontal: 32,
                borderTopColor: '#00000010',
                borderTopWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: 12
              }}
            >
              <VotingButton type='unlike' handleVote={() => handleVote('unlike')} />
              <VotingButton type='like' handleVote={() => handleVote('like')} />
            </View>
          }
          {/* <CustomDrawer
            isOpen={openClaim}
            onClose={() => setOpenClaim(false)}
            style={{
              padding: 0,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: '70%',
              paddingHorizontal: 16
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 12,
                marginRight: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setOpenClaim(false);
                }}
                style={{
                  backgroundColor: '#F0F0F0',
                  width: 30,
                  height: 30,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 999
                }}
              >
                <FontAwesomeIcon
                  icon={faClose}
                  size={16}
                  color='black'
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 8,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                source={require('../../assets/old-image/geotag.png')}
                style={{
                  marginBottom: 24,
                  width: 82,
                  height: 124
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '600',
                  lineHeight: 40
                }}
              >
                Earned 100pts reward
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  lineHeight: 24,
                  color: '#00000070',
                  marginTop: 12
                }}
              >
                You earned reward for contributing valuable insights to local community.
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#9DFF50',
                paddingVertical: 12,
                marginTop: 'auto',
                marginBottom: 40,
                borderRadius: 24
              }}
            >
              <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontWeight: '600',
                textAlign: 'center'
              }}
              >
                Claim
              </Text>
            </TouchableOpacity>
          </CustomDrawer> */}
        </>
      }
    </>
  )
}
