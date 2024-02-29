import BeaconImage from '@/components/beacon/BeaconImage'
import { faArrowLeft, faCamera, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Dimensions, Image, Keyboard, Pressable, SafeAreaView, StatusBar, Text, TextInput, TouchableHighlight, View } from 'react-native'
import OutsidePressHandler from 'react-native-outside-press'

export default function EnterInfo() {
    const [desc, setDesc] = useState('')
    return (
        <SafeAreaView
            style={{
                flex: 1,
                // paddingVertical: 30,
                backgroundColor: '#131313',
                minHeight: Dimensions.get('screen').height - (StatusBar.currentHeight || 40)
            }}
        >
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4,
                paddingHorizontal: 20,
                paddingVertical: 30
            }}>
                <Pressable onPress={() => router.replace('/beacon/add-image')}>
                    <FontAwesomeIcon icon={faArrowLeft} size={16} color='#FFFFFFB2' />
                </Pressable>
                <Text style={{ fontSize: 16 * 1.1, fontWeight: '700', color: 'white', flex: 1, textAlign: 'center' }}>
                    Add your moment
                </Text>
            </View>
            <View
                style={{
                    flex: 1,
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={require('../../assets/beacon/beacon-checkin-image.png')}
                        style={{
                            width: 283,
                            height: 283,
                            objectFit: 'cover',
                            marginTop: 26
                        }}
                    />
                </View>
                <View
                    style={{
                        marginTop: 65,
                        paddingHorizontal: 20
                    }}
                >
                    <OutsidePressHandler
                        onOutsidePress={() => {
                            Keyboard.dismiss()
                        }}
                    >
                        <TextInput
                            value={desc}
                            placeholder='Write something about this place...'
                            onChangeText={(value) => setDesc(value)}
                            placeholderTextColor={'rgba(255, 255, 255, 0.50)'}
                            style={{
                                fontSize: 16,
                                color: 'white',
                                textAlignVertical: 'top'
                            }}
                            numberOfLines={1}
                        />
                    </OutsidePressHandler>
                </View>
                <View
                    style={{
                        marginVertical: 24,
                        height: 1,
                        width: Dimensions.get('screen').width,
                        backgroundColor: '#505050'
                    }} />
                <View
                    style={{
                        paddingHorizontal: 20
                    }}
                >
                    <Text
                        style={{
                            fontSize: 13,
                            color: '#BDBDBA',
                            fontWeight: 'bold',
                            marginBottom: 12,
                        }}
                    >
                        Checkin at
                    </Text>

                    <View
                        style={{
                            borderRadius: 12,
                            overflow: 'hidden',
                            backgroundColor: '#212121de',
                            paddingHorizontal: 12,
                            paddingVertical: 20
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                fontWeight: '500'
                            }}
                        >
                            Steak House
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        marginBottom: (StatusBar.currentHeight || 40)
                    }}
                >
                    <View
                        style={{
                            marginVertical: 24,
                            height: 1,
                            width: Dimensions.get('screen').width,
                            backgroundColor: '#505050'
                        }} />
                    <TouchableHighlight
                        style={{
                            backgroundColor: '#2E2E2E',
                            borderRadius: 24,
                            paddingVertical: 12,
                            marginHorizontal: 20
                        }}
                        onPress={() => router.replace('/beacon/sucess')}
                    >
                        <View
                        style={{
                            display:'flex',
                            flexDirection:'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            columnGap: 8
                    }}
                        >
                        <FontAwesomeIcon icon={faCheckCircle} color='white'/>
                            <Text
                                style={{
                                    color: '#FFF',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontWeight: '700',
                                    lineHeight: 24,
                                }}
                            >
                                Confirm
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        </SafeAreaView>
    )
}
