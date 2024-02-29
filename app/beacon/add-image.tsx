import BeaconImage from '@/components/beacon/BeaconImage'
import { faArrowLeft, faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Dimensions, Image, Pressable, SafeAreaView, StatusBar, Text, TouchableHighlight, View } from 'react-native'

export default function AddImage() {
    const [image, setImage] = useState(true);
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
                <Pressable onPress={() => router.replace('/')}>
                    <FontAwesomeIcon icon={faArrowLeft} size={16} color='#FFFFFFB2' />
                </Pressable>
                <Text style={{ fontSize: 16 * 1.1, fontWeight: '700', color: 'white', flex: 1, textAlign: 'center' }}>
                    Add your moment
                </Text>
                <TouchableHighlight
                    onPress={() => {
                        if (image) {
                            router.replace('/beacon/enter-info')
                        }
                    }}
                >
                    <Text style={{ fontSize: 16 * 1.1, fontWeight: '700', color: (image ? '#99FF48' : '#F5F5F550'), textAlign: 'center' }}>
                        Next
                    </Text>
                </TouchableHighlight>
            </View>
            <View
                style={{
                    flex: 1,
                }}
            >
                <Image
                    source={require('../../assets/beacon/beacon-checkin-image.png')}
                    style={{
                        width: Dimensions.get('screen').width + 20,
                        height: 375,
                        objectFit: 'cover'
                    }}
                />
                <BeaconImage />
            </View>
        </SafeAreaView>
    )
}
