import React from 'react'
import { Pressable, Text, View } from 'react-native'

export default function NotLoginComponent() {
    return (
        <View className='w-screen h-screen flex-col items-center justify-center px-5'>
            <Text className='text-[#000000B2] text-[15x] leading-6 mb-4'>Please login first to explore this</Text>
            <Pressable className='rounded-3xl bg-black w-full h-fit py-3 border-none'>
                <Text className='font-semibold text-base text-white leading-6 text-center'>
                    Login
                </Text>
            </Pressable>
        </View>
    )
}
