import LoadingSpinner from '@/components/LoadingSpinner';
import { addFriend, getUserById } from '@/middleware/data/user';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg';
import { useSelector } from 'react-redux';

export default function Friend() {
    const { id: requestFriendId } = useLocalSearchParams();
    const user = useSelector((state: any) => state.user);
    const [rqFriendData, setRqFriendData] = useState<any>(null);
    const [addFriendMess, setAddFriendMess] = useState<any>(null);
    const [addFriendLoading, setAddFriendLoading] = useState(false);
    useEffect(() => {
        (async () => {
            const data = await getUserById(requestFriendId);
            setRqFriendData(data);
        })()
    }, [])
    if (!user) {
        router.replace('/sign-in');
    }
    const handleAddFriend = async () => {
        setAddFriendLoading(true);
        const result = await addFriend(requestFriendId, user.id)
        setAddFriendMess(result);
        setAddFriendLoading(false);
        setTimeout(() => {
            router.replace('/')
        }, 1000)
    }
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <TouchableOpacity
                onPress={() => { router.replace('/') }}
                style={{
                    position: 'absolute',
                    left: 20,
                    top: 20
                }}
            >
                <Svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                >
                    <Path
                        d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
                        fill='black'
                        fillOpacity='0.7'
                    />
                </Svg>
            </TouchableOpacity>
            <View
                style={{
                    padding: 4,
                    borderWidth: 2,
                    borderColor: '#9AA8ED',
                    width: 200,
                    height: 200,
                    borderRadius: 999,
                }}
            >
                <Image
                    source={rqFriendData?.profileImage}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 999,
                    }}
                    contentFit='cover'
                />
            </View>
            <Text
                style={{
                    marginTop: 20,
                    fontSize: 16,
                    fontWeight: '600'
                }}>
                {rqFriendData?.name}
            </Text>
            <TouchableOpacity
                onPress={handleAddFriend}
                style={{
                    backgroundColor: '#99FF48',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                    padding: 16,
                    borderRadius: 20
                }}>
                {addFriendLoading ?
                    <LoadingSpinner />
                    :
                    <Text
                        style={{
                            fontSize: 16,
                            lineHeight: 16,
                            fontWeight: '600'
                        }}>
                        {addFriendMess ?? 'Addfriend'}
                    </Text>
                }
            </TouchableOpacity>
        </View>
    )
}
