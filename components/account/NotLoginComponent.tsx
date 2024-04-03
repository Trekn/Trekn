import React from "react";
import { Text, View } from "react-native";


export default function NotLoginComponent() {
    return (
        <View className="flex flex-col items-center justify-center h-screen w-screen pb-20 px-5 gap-4">
            <Text className='text-[#000000B2] text-[15x] leading-6'>Please login first to explore this</Text>
            <View className=' rounded-3xl bg-black w-full h-fit py-3 border-none'>
                <Text className='font-semibold text-base text-white leading-6 text-center'>
                    Login
                </Text>
            </View>
        </View>
    )
}
