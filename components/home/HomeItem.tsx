import { calculateDistance, convertDistance } from '@/functions/calculateDistance';
import { getScore } from '@/utils/account.util';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { useSelector } from 'react-redux';

interface HomeItemProps {
    data: any
}

const HomeItem = React.memo(({ data }: HomeItemProps) => {
    const user = useSelector((state: any) => state.user);
    return (
        <Pressable
            onPress={() => router.replace(`/detail/${data.id}`)}
        >
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 12,
                    borderColor: '#00000010',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 12
                }}
            >
                <Image
                    source={data?.image.endsWith('.MOV') || data?.image.endsWith('.mp4') ? require('../../assets/icon/default.png'): data?.image}
                    style={{
                        height: 120,
                        width: 120,
                        borderBottomLeftRadius: 12,
                        borderTopLeftRadius: 12,
                        backgroundColor: '#ccc'
                    }}
                    placeholder={require('../../assets/icon/default.png')}
                />
                <View
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 16
                    }}
                >
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: 8
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                lineHeight: 24,
                                fontWeight: '500',
                                paddingRight: 10
                            }}
                            numberOfLines={1}
                        >
                            {data?.name}
                        </Text>
                        <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
                            {
                                data?.reaction?.length > 0 &&
                                <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 4 }}>
                                    <FontAwesomeIcon color='#FFB800' size={16} icon={faThumbsUp} />
                                    <Text style={{ color: 'black', opacity: data?.reaction.length > 0 ? 1 : 0.7, fontSize: 14, lineHeight: 20 }}>{getScore(data, false)}</Text>
                                </View>
                            }
                            <View
                                style={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: 999,
                                    backgroundColor: 'black'
                                }}
                            />
                            <Text style={{ color: 'black', fontSize: 14, lineHeight: 20 }}>
                                {convertDistance(
                                    calculateDistance(
                                        data.lat || data?.drop.lat,
                                        data.lng || data?.drop.lng,
                                        data.user.lat || user.lat,
                                        data.user.lng || user.lng
                                    )
                                )}{' '}
                                away
                            </Text>
                        </View>
                        <View
                            style={{
                                backgroundColor: '#EEEEEE90',
                                padding: 8,
                                width: 100,
                                borderRadius: 999,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '500' }}>{data?.minted?.length} check-ins</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
});

export default HomeItem;
