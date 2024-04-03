import { capitalizeFirstLetter, formatLocation } from '@/functions/text'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import CustomCarousel from '../carousel/Carousel'
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFaceFrown, faFaceKissWinkHeart, faFaceLaughBeam, faFaceMeh, faFaceSadCry, faMapPin, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { getScore } from '@/utils/account.util';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import Line from './Line';

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

export default function Detail({ dropData }: any) {
    const typeList = useSelector((state: any) => state.config?.dropType);
    
    return (
        <ScrollView>
            <View>
                {dropData?.type &&
                    <Text
                        style={{
                            fontSize: 13,
                            lineHeight: 24,
                            color: '#00000050',
                            fontWeight: '500'
                        }}
                    >{capitalizeFirstLetter(typeList[dropData?.type]?.type)}</Text>
                }
                <Text style={{ fontWeight: '600', fontSize: 20, lineHeight: 36, color: 'black', marginBottom: 12 }}>
                    {dropData?.name}
                </Text>
                <View style={{ display: 'flex', flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
                    {
                        dropData?.reaction?.length > 0 &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 4 }}>
                            <FontAwesomeIcon color='#000000' size={16} icon={faThumbsUp} />
                            <Text style={{ color: 'black', opacity: dropData?.reaction?.length > 0 ? 1 : 0.7, fontSize: 14, lineHeight: 20 }}>{getScore(dropData, true)}</Text>
                        </View>
                    }
                    {dropData.location &&
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
                                {formatLocation(dropData.location)}
                            </Text>
                        </>
                    }
                </View>
            </View>
            <Line />
            <View style={{ position: 'relative', height: 399 }}>
                {dropData?.drop?.imageArray || dropData?.imageArray ?
                    <CustomCarousel data={dropData} />
                    :
                    <Image
                        source={{ uri: dropData?.image || dropData?.drop?.image }}
                        alt='Drop Img'
                        style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 12,
                        }}
                    />
                }
            </View>
            {dropData?.description &&
                <>
                    <Line />
                    <Text
                        style={{
                            fontSize: 15,
                            lineHeight: 24,
                            color: '#02030390'
                        }}
                    >
                        {dropData?.description}
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
                    {formatLocation(dropData.location)}
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
                            latitude: dropData.lat,
                            longitude: dropData.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        minZoomLevel={15}
                        style={{
                            height: 200,
                        }}
                    >
                        <Marker
                            coordinate={{ longitude: dropData.lng, latitude: dropData.lat }}
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
                {dropData?.minted && dropData?.minted?.length > 0 ? (
                    dropData?.minted?.map((minted: any, idx: number) => (
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
        </ScrollView>
    )
}
