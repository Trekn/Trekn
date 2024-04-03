import React from 'react'
import { Text, View } from 'react-native'

export default function EnableLocationComponent() {
    const tutorial: Array<string> = [
        'Go to your device\'s Settings.',
        'Find your browser app in the list and tap on it.',
        'Select \'Location\' and choose \'While Using the App\'.'
    ]
    return (
        <View className="flex flex-col items-center justify-center h-screen w-screen pb-20 px-5">
            <img src='/geotag.png' alt='' className='object-cover object-center w-[82px] h-[124px] mb-6' />
            <View className="flex flex-col gap-3 px-3">
                <Text className='text-[15px] leading-6 font-medium'>To help you discover the best around you, we need your location access.</Text>
                <View className="h-[1px] bg-[#D9D9D994]" />
                <Text className='text-[15px] leading-6 font-medium text-[#00000080]'>
                    How to Enable Location Access:
                </Text>
                {tutorial.map((text: string) =>
                    <View className="flex items-center gap-3 py-2">
                        <View className="w-2 h-2 rounded-full bg-[#99FF48]" />
                        <Text className='text-[15px] leading-[18px] font-medium'>
                            {text}
                        </Text>
                    </View>
                )}

            </View>
            <View className=' rounded-3xl bg-black w-full h-fit py-3 border-none mt-4'>
                <Text className='font-semibold text-base text-white leading-6 text-center'>
                    Enable
                </Text>
            </View>
        </View>
    )
}