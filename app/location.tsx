import React from 'react'
import { Image, Linking, TouchableOpacity, Text, View } from 'react-native'
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { updateCoordinate } from '@/redux/slides/userSlides';

export default function EnableLocationComponent() {
    const dispatch = useDispatch();
    const tutorial: Array<string> = [
        'Go to your device\'s Settings.',
        'Find your browser app in the list and tap on it.',
        'Select \'Location\' and choose \'While Using the App\'.'
    ]
    const onRequest = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'denied') {
            Linking.openSettings();
        } else {
            let { coords } = await Location.getCurrentPositionAsync({});
            dispatch(
                updateCoordinate({
                    lat: coords.latitude,
                    lng: coords.longitude,
                })
            );
            router.replace('/')
        }
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 20, paddingHorizontal: 5, backgroundColor: 'white' }}>
            <Image source={require('../assets/old-image/geotag.png')} style={{ width: 82, height: 124, marginBottom: 6 }} />
            <View style={{ flex: 1, flexDirection: 'column', gap: 3, paddingHorizontal: 3 }}>
                <Text style={{ fontSize: 15, lineHeight: 24, fontWeight: 'bold' }}>To help you discover the best around you, we need your location access.</Text>
                <View style={{ height: 1, backgroundColor: '#D9D9D994' }} />
                <Text style={{ fontSize: 15, lineHeight: 24, fontWeight: 'bold', color: '#00000080' }}>How to Enable Location Access:</Text>
                {tutorial.map((text, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 2 }}>
                        <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: '#99FF48' }} />
                        <Text style={{ fontSize: 15, lineHeight: 18, fontWeight: 'bold' }}>{text}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity
                style={{ borderRadius: 16, backgroundColor: 'black', width: '100%', alignSelf: 'stretch', marginTop: 4 }}
                onPress={onRequest}
            >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', lineHeight: 24, textAlign: 'center', paddingVertical: 9 }}>
                    Enable
                </Text>
            </TouchableOpacity>
        </View>
    )
}