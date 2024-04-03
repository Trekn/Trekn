import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import LoadingSpinner from '../LoadingSpinner'

export default function Validating() {
    return (
        <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8
        }}
        >
            <ActivityIndicator size={16} color={'#000'}/>
            <Text
            style={{
                fontSize: 13,
                lineHeight: 16,
                fontWeight: '500'
            }}
            >Validating content</Text>
        </View>
    )
}
