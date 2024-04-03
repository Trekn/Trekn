import { faLink, faShareSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Share from 'react-native-share';
import { useSelector } from 'react-redux'

export default function AddFriendList() {
    const user = useSelector((state: any) => state.user);
    const sharingUrl = `https://app.trekn.xyz/links/${user.id}`
    return (
        <View
            style={{
                paddingHorizontal: 20
            }}>
            <Text
                style={{
                    fontSize: 24,
                    color: '#080808',
                    fontWeight: '600',
                    marginTop: 24
                }}
            >Add your friends</Text>
            <View>
                <View
                    style={{
                        marginBottom: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        columnGap: 8,
                        marginTop: 36
                    }}>
                    <FontAwesomeIcon icon={faShareSquare} size={16} color='#484848' />
                    <Text
                        style={{
                            color: '#484848',
                            lineHeight: 18,
                            fontSize: 15,
                            fontWeight: '600'
                        }}
                    >
                        Share your Trekn URL
                    </Text>
                </View>
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        backgroundColor: '#F8F8F8',
                        flexDirection: 'column',
                        rowGap: 16,
                        borderRadius: 16
                    }}
                >
                    {/* <TouchableOpacity
                        onPress={async () => {
                            await Share.shareSingle({
                                message: sharingUrl,
                                social: Share.Social.MESSENGER as any
                            })
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                columnGap: 10,
                                alignItems: 'center'
                            }}
                        >
                            <View
                                style={{
                                    padding: 4,
                                    borderWidth: 1.66,
                                    borderColor: '#DDDEF2',
                                    borderRadius: 999
                                }}
                            >
                                <Image
                                    style={{
                                        width: 48,
                                        height: 48,
                                    }}
                                    source={require('../../assets/icon/messenger.png')} />
                            </View>
                            <Text
                                style={{
                                    fontWeight: '500',
                                    color: '#5B5B5B',
                                    fontSize: 16
                                }}
                            >Messenger</Text>
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={async () => {
                            await Share.shareSingle({
                                message: sharingUrl,
                                social: Share.Social.INSTAGRAM as any
                            })
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                columnGap: 10,
                                alignItems: 'center'
                            }}
                        >
                            <View
                                style={{
                                    padding: 4,
                                    borderWidth: 1.66,
                                    borderColor: '#DDDEF2',
                                    borderRadius: 999
                                }}
                            >

                                <Image
                                    style={{
                                        width: 48,
                                        height: 48,
                                    }}
                                    source={require('../../assets/icon/insta.png')} />
                            </View>
                            <Text
                                style={{
                                    fontWeight: '500',
                                    color: '#5B5B5B',
                                    fontSize: 16
                                }}
                            >Instagram</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => {
                            await Share.shareSingle({
                                message: sharingUrl,
                                social: Share.Social.TELEGRAM as any
                            })
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                columnGap: 10,
                                alignItems: 'center'
                            }}
                        >
                            <View
                                style={{
                                    padding: 4,
                                    borderWidth: 1.66,
                                    borderColor: '#DDDEF2',
                                    borderRadius: 999
                                }}
                            >

                                <Image
                                    style={{
                                        width: 48,
                                        height: 48,
                                    }}
                                    source={require('../../assets/icon/tele.png')} />
                            </View>
                            <Text
                                style={{
                                    fontWeight: '500',
                                    color: '#5B5B5B',
                                    fontSize: 16
                                }}
                            >Telegram</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => {
                            await Share.open({
                                message: sharingUrl
                            })
                        }}>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                columnGap: 10,
                                alignItems: 'center'
                            }}
                        >
                            <View
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 999,
                                    backgroundColor: '#99FF48',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <FontAwesomeIcon icon={faLink} size={18} />
                            </View>
                            <Text
                                style={{
                                    fontWeight: '500',
                                    color: '#5B5B5B',
                                    fontSize: 16
                                }}
                            >Orthers</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
