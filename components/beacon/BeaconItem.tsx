import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableHighlight, View } from 'react-native'

export default function BeaconItem() {
    return (
        <TouchableHighlight
            style={
                {
                    marginVertical: 40,
                    padding: 12,
                    backgroundColor: '#F5F5F5',
                    borderRadius: 12,
                }
            }
            onPress={() => router.replace('/beacon/loading')}
            underlayColor={'#F5F5F550'}
        >
            <>
                <Text
                    style={{
                        color: '#00000050',
                        fontSize: 13,
                        fontWeight: '600',
                        marginBottom: 12
                    }}>
                    Checkin at
                </Text>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        columnGap: 12
                    }}
                >
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                        style={{
                            borderRadius: 12,
                            width: 96,
                            height: 96
                        }}
                    />
                    <View>
                        <Text>
                            Steak House
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            columnGap: 4,
                            marginTop: 8,
                            marginBottom: 16
                        }}>
                            <FontAwesomeIcon color='#FFB800' size={16} icon={faThumbsUp} />
                            <Text style={{ fontSize: 14, fontWeight: '500', lineHeight: 20 }}>4.9</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: 3 * 22.5 }}
                            >
                                {[
                                    'https://source.boringavatars.com/pixel/120/Maria%20Mitchell?colors=264653,2a9d8f,e9c46a,f4a261,e76f51',
                                    'https://source.boringavatars.com/pixel/120/Maria%20Mitchell',
                                    'https://source.boringavatars.com/pixel/120/Maria%20Mitchell?colors=757122,2a9a8f,e9c21a,f4a261,e76f51'
                                ].map((item, idx) => (
                                    <Image
                                        key={idx}
                                        source={{ uri: item }}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: 'white',
                                            width: 28,
                                            height: 28,
                                            borderRadius: 50,
                                            left: idx * 13.75,
                                            zIndex: idx + 1,
                                            backgroundColor: 'white',
                                            position: 'absolute',
                                        }}
                                    />
                                ))}
                            </View>
                            <View style={{ backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 15 }}>
                                <Text style={{ fontSize: 13, fontWeight: '500', color: 'black', lineHeight: 13 }}>12 check-ins</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </>
        </TouchableHighlight>
    )
}
