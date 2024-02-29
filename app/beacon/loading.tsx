import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native'
import { MaterialIndicator } from 'react-native-indicators';

export default function Loading() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setTimeout(() => router.replace('/beacon/add-image'), 1000);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [])
    return (
        <SafeAreaView
            style={{ flex: 1, paddingVertical: 30, paddingHorizontal: 20, backgroundColor: '#131313', minHeight: Dimensions.get('screen').height - (StatusBar.currentHeight || 40) }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Pressable onPress={() => router.replace('/')}>
                    <FontAwesomeIcon icon={faArrowLeft} size={16} color='#FFFFFFB2' />
                </Pressable>
                <Text style={{ fontSize: 16 * 1.1, fontWeight: '700', color: 'white', flex: 1, textAlign: 'center' }}>
                    Validating location
                </Text>
            </View>
            <View style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {loading ?
                    <View>
                        <View style={
                            {
                                height: 80
                            }
                        }>
                            <MaterialIndicator color='#99FF48' size={80} />
                        </View>
                        <Text
                            style={{
                                color: '#BDBDBD',
                                fontSize: 13,
                                fontWeight: '500',
                                marginTop: 16
                            }}
                        >
                            Searching for nearby beacon
                        </Text>
                    </View>
                    :
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            style={{
                                height: 158,
                                width: 158
                            }}
                            source={require('../../assets/beacon/beacon-success.png')}
                        />
                        <Text
                            style={{
                                color: '#BDBDBD',
                                fontSize: 13,
                                fontWeight: '500',
                                marginTop: 16
                            }}
                        >
                            You’re ready to checkin
                        </Text>
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}
