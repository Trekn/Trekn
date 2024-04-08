import { useDispatch, useSelector } from 'react-redux';
import {
  checkClassNameAccountItem,
  getScore,
  sortDataByTimeline,
} from '../../utils/account.util';
import { getUserAccountData, unLinkWallet } from '../../middleware/data/user';
import { updateUser } from '../../redux/slides/userSlides';
import { setAccountData } from '../../redux/slides/accountSlice';
import {
  faArrowLeft,
  faClone,
  faMapPin,
  faPlusCircle,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { Fragment, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image as ImageRn,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import {
  calculateDistance,
  convertDistance,
} from '../../functions/calculateDistance';
import Svg, { G, Mask, Path, Rect } from 'react-native-svg';
import { Image } from 'expo-image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuthContext } from '@/context/AuthContext';
import * as Clipboard from 'expo-clipboard';

export default function Account() {
  const { signOut, connectWallet } = useAuthContext();
  const dispatch = useDispatch();
  const user: any = useSelector((state: any) => state.user);
  const { id: userId } = useLocalSearchParams();
  const userAccountData = useSelector((state: any) => state.account);
  const [userData, setUserData] = useState<any[]>(userAccountData?.data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !Object.entries(userAccountData.data)?.length ||
      (new Date().getTime() - userAccountData.lastFetch) / 1000 > 300
    ) {
      (async () => {
        setLoading(true);
        await getAccountData();
        setLoading(false);
      })();
    }
  }, [user.address, user.id, userId]);

  const getAccountData = async () => {
    const userData: any = [];
    if (
      userId !== '0' ||
      userId !== userAccountData?.id ||
      user.id !== userAccountData?.id
    ) {
      const _userAccountData = await getUserAccountData({
        userId: Number(userId) || user.id,
      });
      userData.push(
        ...[
          ..._userAccountData?.drop.map((item: any) => {
            item.type = 'drop';
            return { ...item };
          }),
          ..._userAccountData?.minted.map((item: any) => {
            item.type = 'minted';
            return item;
          }),
        ]
      );
    } else {
      userData.push(
        ...[
          ...JSON.parse(JSON.stringify(userAccountData))?.drop.map(
            (item: any) => {
              item.type = 'drop';
              return { ...item };
            }
          ),
          ...JSON.parse(JSON.stringify(userAccountData))?.minted.map(
            (item: any) => {
              item.type = 'minted';
              return item;
            }
          ),
        ]
      );
    }
    const data = sortDataByTimeline(userData);
    dispatch(setAccountData(data));
    setUserData(data);
    setRefreshing(false);
  };

  const isFollowed = () => {
    if (user.id) {
      return '0';
      return user?.following?.find((item: number) => item === Number(userId));
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAccountData();
  }, []);

  return (
    <SafeAreaView
      style={{
        width: Dimensions.get('screen').width,
        position: 'relative',
      }}
    >
      {loading ? (
        <View
          style={{
            height: Dimensions.get('screen').height,
          }}
        >
          <LoadingSpinner />
        </View>
      ) : (
        <ScrollView
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{
              width: '100%',
              marginBottom: 0,
            }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {userId !== '0' && (
                <Pressable onPress={() => router.replace('/')}>
                  <FontAwesomeIcon icon={faArrowLeft} size={17} />
                </Pressable>
              )}

              {userId === '0' && !user.address && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#F4F4F4',
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    marginBottom: 20,
                  }}
                  onPress={async () => {
                    await connectWallet();
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      color: 'black',
                    }}
                  >
                    Connect wallet
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View
              style={{
                marginHorizontal: 16,
                marginBottom: 24,
              }}
            >
              {!userId ||
                (userId === '0' && user.address && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                      paddingHorizontal: 4,
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'black',
                          fontSize: 16,
                          fontWeight: '600',
                        }}
                      >
                        {user.address.slice(0, 2)}...
                        {user.address.slice(-6, -1)}
                      </Text>
                      <TouchableOpacity
                        onPress={async () =>
                          await Clipboard.setStringAsync(user.address)
                        }
                      >
                        <FontAwesomeIcon
                          icon={faClone}
                          size={12}
                          style={{ marginLeft: 8 }}
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#F4F4F4',
                        borderRadius: 999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                      }}
                      onPress={async () => {
                        await unLinkWallet({ userId: user.id });

                        dispatch(updateUser({ ...user, address: '' }));
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: '500',
                          color: 'black',
                        }}
                      >
                        Disconnect wallet
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}

              <View
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    position: 'relative',
                    borderRadius: 999,
                    width: 100,
                    height: 100,
                    overflow: 'hidden',
                  }}
                >
                  {!loading ? (
                    <>
                      {user.profileImage ? (
                        <ImageRn
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            backgroundColor: '#ccc',
                          }}
                          onLoad={(e) => {
                            console.log(e);
                          }}
                          onError={(e) => {
                            console.log(e);
                          }}
                          alt='User Profile Image'
                          source={{ uri: user.profileImage }}
                        />
                      ) : (
                        <Svg
                          viewBox='0 0 96 96'
                          fill='none'
                          role='img'
                          width={100}
                          height={100}
                          style={{ width: 100, height: 100 }}
                        >
                          <Mask
                            id=':r6:'
                            maskUnits='userSpaceOnUse'
                            x='0'
                            y='0'
                            width='96'
                            height='96'
                          >
                            <Rect
                              width='96'
                              height='96'
                              rx='72'
                              fill='#FFFFFF'
                            ></Rect>
                          </Mask>
                          <G mask='url(#:r6:)'>
                            <Rect width='96' height='96' fill='#ff7d10' />
                            <Rect
                              x='0'
                              y='0'
                              width='96'
                              height='96'
                              transform='translate(4 4) rotate(340 18 18) scale(1.1)'
                              fill='#0a0310'
                              rx='96'
                            />
                            <G transform='translate(-4 -1) rotate(0 18 18)'>
                              <Path
                                d='M45 60c6 3 12 3 18 0'
                                stroke='#FFFFFF'
                                fill='none'
                                stroke-linecap='round'
                              ></Path>
                              <Rect
                                x='42'
                                y='42'
                                width='3.5'
                                height='6'
                                rx='3'
                                stroke='none'
                                fill='#FFFFFF'
                              ></Rect>
                              <Rect
                                x='60'
                                y='42'
                                width='3.5'
                                height='6'
                                rx='3'
                                stroke='none'
                                fill='#FFFFFF'
                              ></Rect>
                            </G>
                          </G>
                        </Svg>
                      )}
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: '#ccc',
                          zIndex: 10,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          top: 0,
                        }}
                      ></View>
                    </>
                  )}
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {/* <TouchableOpacity
                    style={{
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: 'black',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 9,
                    }}
                  >
                    <FontAwesomeIcon icon={faShare} size={12} />
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={{
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: 'black',
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                    }}
                    onPress={() => {
                      if (userId === '0') {
                        router.replace('/account/edit');
                      } else {
                        // userId ? handleFollow() : null;
                      }
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '500',
                        fontSize: 16,
                        lineHeight: 16,
                        letterSpacing: -0.08,
                      }}
                    >
                      {userId && userId !== '0'
                        ? isFollowed()
                          ? 'Unfollow'
                          : 'Follow'
                        : 'Edit profile'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  paddingHorizontal: 8,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 24,
                    }}
                  >
                    {!loading &&
                      (userId !== '0' ? userAccountData?.name : user.name)}
                  </Text>
                  {!userAccountData?.name ||
                    (!user.name && (
                      <>
                        <Text
                          style={{
                            fontWeight: '600',
                            fontSize: 24,
                          }}
                        >
                          No name
                        </Text>
                        <Text
                          style={{
                            fontWeight: '300',
                            fontSize: 13,
                          }}
                        >
                          Edit to set your name
                        </Text>
                      </>
                    ))}
                </View>
                {/* <Text
                  style={{
                    marginVertical: 12,
                    fontSize: 13,
                    lineHeight: 13 * (140 / 100),
                    color: '#000000b3',
                  }}
                >
                  {!loading &&
                    (userId ? userAccountData.description : user.description)}
                </Text> */}
              </View>
            </View>

            <View
              style={{
                paddingBottom: 40,
              }}
            >
              {Object.entries(userData)?.map(([key, data], dataIdx) => (
                <Fragment key={dataIdx}>
                  <View
                    style={{
                      backgroundColor: '#F3F3F3',
                      width: '42%',
                      paddingVertical: 8,
                      paddingRight: 12,
                      borderTopRightRadius: 999,
                      borderBottomRightRadius: 999,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '500',
                      }}
                    >
                      {key}
                    </Text>
                    <View
                      style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: '#B2B2B2',
                        left: 55.2,
                      }}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          width: 2,
                          height: 90,
                          backgroundColor: '#B2B2B2',
                          left: 3,
                          top: dataIdx !== 0 ? -20 : 0,
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 14,
                      marginTop: 36,
                    }}
                  >
                    {data &&
                      data.map((item: any, itemIdx: number) => (
                        <Pressable
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: 36,
                            alignItems: 'stretch',
                            columnGap: 12,
                          }}
                          key={itemIdx}
                          onPress={async () => {
                            //   if (item?.type === 'minted') {
                            //     const { data } = await supabase
                            //       .from('reaction')
                            //       .select('*')
                            //       .eq('drop_id', item?.drop_id || item?.id)
                            //       .eq('user_id', user?.id);
                            //     if (data && data.length === 0 && !userId) {
                            //       navigate(
                            //         `/reaction/${item?.drop_id || item?.id}`
                            //       );
                            //     } else {
                            //       navigate(
                            //         `/drop/details/${item?.drop_id || item?.id}`
                            //       );
                            //     }
                            //   } else {
                            //     navigate(
                            //       `/drop/details/${item?.drop_id || item?.id}`
                            //     );
                            //   }
                          }}
                        >
                          <View
                            style={{
                              width: 88,
                              height: 88,
                              position: 'relative',
                              zIndex: 20,
                            }}
                          >
                            <Image
                              source={item?.drop?.image || item?.image}
                              alt='Drop Img'
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 12,
                                objectFit: 'cover',
                              }}
                            />
                            {/* <LazyImageCustom
                                src={item?.drop?.image || item?.image}
                                alt='Drop Img'
                                className='w-full h-full rounded-xl object-cover skeleton'
                              /> */}
                            <View
                              style={{
                                width: 2,
                                height: checkClassNameAccountItem(
                                  itemIdx,
                                  data,
                                  dataIdx,
                                  userData
                                ),
                                left: 44,
                                bottom: 0,
                                backgroundColor: '#B2B2B2',
                              }}
                            ></View>
                          </View>

                          <View
                            style={{
                              flexGrow: 1,
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              display: 'flex',
                              marginVertical: 8,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                display: 'flex',
                                columnGap: 4,
                              }}
                            >
                              {item?.type === 'minted' ? (
                                <FontAwesomeIcon icon={faMapPin} size={12} />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faPlusCircle}
                                  size={12}
                                />
                              )}
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: '500',
                                  color: '#02030380',
                                }}
                              >
                                {`${
                                  item?.type === 'minted'
                                    ? 'Checked-in'
                                    : 'Created'
                                } at ${moment(item?.created_at).format(
                                  'hh:ss A'
                                )}`}
                              </Text>
                            </View>

                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: '500',
                                lineHeight: 18,
                              }}
                            >
                              {item?.drop?.name || item?.name}
                            </Text>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  display: 'flex',
                                  columnGap: 2,
                                  marginRight: 8,
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faThumbsUp}
                                  color='#FFB800'
                                  size={12}
                                />
                                <Text
                                  style={{
                                    lineHeight: 16,
                                    fontSize: 13,
                                    color: '#000000b3',
                                    fontWeight: '500',
                                  }}
                                  // className={`text-[13px] ${
                                  //   Number(getScore(item, false))
                                  //     ? 'text-[#000000b3]'
                                  //     : 'text-[#02030380]'
                                  // } font-medium`}
                                >
                                  {getScore(item, false)}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  display: 'flex',
                                  columnGap: 8,
                                }}
                              >
                                <View
                                  style={{
                                    borderRadius: 999,
                                    backgroundColor: '#dfdfdfb3',
                                    width: 8,
                                    height: 8,
                                  }}
                                />
                                <Text
                                  style={{
                                    fontSize: 13,
                                    color: '#02030380',
                                    fontWeight: '500',
                                  }}
                                >
                                  {convertDistance(
                                    calculateDistance(
                                      item.lat || item?.drop.lat,
                                      item.lng || item?.drop.lng,
                                      user.lat,
                                      user.lng
                                    )
                                  )}{' '}
                                  away
                                </Text>
                              </View>
                            </View>
                          </View>
                        </Pressable>
                      ))}
                  </View>
                </Fragment>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
