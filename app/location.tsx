import React, { useEffect, useState } from 'react'
import { Image, Linking, TouchableOpacity, Text, View, SafeAreaView, Dimensions, StatusBar, Alert } from 'react-native'
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { updateCoordinate, updateUser } from '@/redux/slides/userSlides';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EnableLocationComponent() {
    const dispatch = useDispatch();
    const [status, setStatus] = useState<string | boolean>(false);
    const tutorial: Array<string> = [
        'Go to your device\'s Settings.',
        'Find your browser app in the list and tap on it.',
        'Select \'Location\' and choose \'While Using the App\'.'
    ]
    useEffect(() => {
        (async () => {
            let { status } = await Location.getForegroundPermissionsAsync();
            setStatus(status)
        })()
    }, [])

    const onRequest = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        setStatus(status)

        let { coords } = await Location.getCurrentPositionAsync({});

        dispatch(
            updateCoordinate({
                lat: coords.latitude,
                lng: coords.longitude,
            })
        );

        const storedData = await AsyncStorage.getItem('user');
        const storedUser = storedData ? JSON.parse(storedData) : null;
        if(status !== 'denied') {
            if (storedUser?.id) {
                dispatch(updateUser(storedUser));
                router.replace('/');
            } else {
                router.replace('/sign-in');
            }
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <Image source={require('../assets/old-image/geotag.png')} style={{ width: 82, height: 124, marginBottom: 24 }} />
            <View style={{ flex: 1, flexDirection: 'column', rowGap: 12, paddingHorizontal: 12 }}>
                <Text style={{ fontSize: 15, lineHeight: 24, fontWeight: 'bold' }}>
                    To help you discover the best around you, we need your location access.
                </Text>
                {status === 'denied' &&
                    <>
                        <View style={{ height: 1, backgroundColor: '#D9D9D994' }} />
                        <Text style={{ fontSize: 15, lineHeight: 24, fontWeight: 'bold', color: '#00000080' }}>How to Enable Location Access:</Text>
                        {tutorial.map((text, index) => (
                            <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingVertical: 8 }}>
                                <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#99FF48' }} />
                                <Text style={{ fontSize: 15, lineHeight: 18, fontWeight: '500' }}>{text}</Text>
                            </View>
                        ))}
                    </>
                }
            </View>
            <View
            style={{
                paddingHorizontal: 20,
                width: '100%',
            }}
            >
                <TouchableOpacity
                    style={{ borderRadius: 16, backgroundColor: 'black', width: '100%', alignSelf: 'stretch', }}
                    onPress={() => {
                        if (status === 'denied') {
                            Alert.alert("For best experience",
                                "Enable location to help TrekN recommend nearby places",
                                [
                                    {
                                        text: 'Enable Location', onPress: async () => {
                                            Linking.openSettings();
                                        }, style: 'default'
                                    },
                                    {
                                        text: 'Continue without sharing', onPress: async () => {
                                            const storedData = await AsyncStorage.getItem('user');
                                            const storedUser = storedData ? JSON.parse(storedData) : null;
                                            if (storedUser?.id) {
                                                dispatch(updateUser(storedUser));
                                                router.replace('/');
                                            } else {
                                                router.replace('/sign-in');
                                            }
                                        }
                                    },
                                ]
                            )
                        } else {
                            onRequest()
                        }
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', lineHeight: 24, textAlign: 'center', paddingVertical: 9 }}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}