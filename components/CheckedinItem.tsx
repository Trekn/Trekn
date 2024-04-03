import React from 'react'
import { checkTimeAgo } from '../utils/common.utils'
import { useAuthContext } from '../context/AuthContext';
import { getScore } from '../utils/account.util';
import { calculateDistance, convertDistance } from '../functions/calculateDistance';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image } from 'expo-image';
import { faMapPin, faPlusCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

export default function CheckedinItem({ data, last }: any) {
    const user = useSelector((state: any) => state.user);
    // const { windowSize } = useAuthContext();
    return (
        <View
            style={{
                paddingBottom: 8,
                marginHorizontal: 20
            }}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }} key={data.id}
            >
                <TouchableOpacity onPress={() => { data?.user.id !== user.id && router.replace(`/account/${data?.user?.id}`) }}>
                    <Image
                        source={data?.user?.profileImage || data?.user?.profileImage}
                        style={{
                            width: 40,
                            height: 40,
                            marginRight: 8,
                            borderRadius: 999,
                            objectFit: 'cover'
                        }}
                        alt=''
                    />
                </TouchableOpacity>

                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }} >
                    <Text
                        style={{
                            fontWeight: '500',
                            fontSize: 16,
                            marginBottom: 8
                        }}>{data?.user?.name}</Text>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        {data?.type === 'minted' ? (
                            <FontAwesomeIcon size={12} icon={faMapPin} />
                        ) : (
                            <FontAwesomeIcon size={12} icon={faPlusCircle} />
                        )}
                        <Text
                            style={{
                                fontWeight: '500',
                                color: 'black',
                                fontSize: 13,
                                opacity: 50,
                                marginLeft: 4
                            }}>
                            {checkTimeAgo(data.created_at)}
                        </Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 12,
                    position: 'relative',
                    marginTop: 12,
                    height: 377,
                    backgroundColor: '#525252',
                }}
                onPress={() => {
                    // setIsDrawerVisible(true);
                    router.replace(`/detail/${data?.drop?.id}`)
                }}
            >
                <View>
                    <View
                        style={{
                            width: Dimensions.get('screen').width - 40,
                            height: 377,
                            borderRadius: 12
                        }}
                    >
                        <Image
                            source={data?.image}
                            style={{
                                width: Dimensions.get('screen').width - 40,
                                height: 377,
                                borderRadius: 12,
                                objectFit: 'cover',
                            }}
                        />
                        {data.imageNft &&
                            <Image
                                source={{ uri: data.imageNft }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    resizeMode: 'cover',
                                    position: 'absolute',
                                    left: 16,
                                    bottom: 0,
                                    zIndex: 40,
                                }}
                            />
                        }
                    </View>
                </View>
            </TouchableOpacity>
            <Text
                style={{
                    marginTop: 8,
                    fontSize: 13,
                    fontWeight: '500',
                    color: '#02030380',
                    lineHeight: 16,
                    letterSpacing: -0.08
                }}>{data?.description}</Text>
            <View
                style={{
                    marginTop: 12,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    borderRadius: 24,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: 16
                }}>
                <Image source={data?.drop.image} alt=""
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: 12,
                        objectFit: 'cover',
                        flexShrink: 0
                    }} />
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingVertical: 8
                    }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            lineHeight: 18,
                            letterSpacing: -0.08,
                            marginBottom: 8
                        }}
                        numberOfLines={1}>{data?.drop.name}</Text>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 8
                            }}>
                            <FontAwesomeIcon size={12} style={{ marginRight: 4 }} color='#FFB800' icon={faThumbsUp} />
                            <Text
                                style={{
                                    fontSize: 14,
                                    opacity: 70
                                }}>{getScore(data, false)}</Text>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 70
                            }}>
                            <Text
                                style={{
                                    marginRight: 8,
                                    width: 11,
                                    color: '#dfdfdfb3'
                                }}>●{' '}</Text>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: '#000000',
                                    opacity: 70,
                                    width: 60
                                }}>
                                {convertDistance(
                                    calculateDistance(
                                        data?.drop.lat,
                                        data?.drop.lng,
                                        user.lat,
                                        user.lng
                                    )
                                )}{' '}
                                away
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            columnGap: 4
                        }}>
                        <Image source={data?.drop?.user?.profileImage}
                            // onClick={() => data?.drop?.user.id !== user.id && router.replace(`/account/${data?.drop?.user?.id}`)}
                            alt=""
                            style={{
                                width: 16,
                                height: 16,
                                borderRadius: 999
                            }}                        //  className="w-4 h-4 rounded-full"
                        />
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '500',
                                lineHeight: 16,
                                letterSpacing: -0.08,
                                opacity: 70,
                            }}
                            numberOfLines={1}>
                            {data?.drop?.user?.name}
                        </Text>
                    </View>
                </View>
            </View>
            {!last &&
                <View
                    style={
                        {
                            borderBottomWidth: 1,
                            marginTop: 24,
                            borderBottomColor: '#EAEAEA'
                        }
                    } />}
        </View >
    )
}
