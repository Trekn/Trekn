import { faCameraRetro } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { Dimensions, Image, Text, View } from 'react-native'
import i1 from '../../assets/beacon/1.png'
import i2 from '../../assets/beacon/2.png'
import i3 from '../../assets/beacon/3.png'
import i4 from '../../assets/beacon/4.png'
import i5 from '../../assets/beacon/5.png'
import i6 from '../../assets/beacon/6.png'
import i7 from '../../assets/beacon/7.png'
import i8 from '../../assets/beacon/8.png'
import i9 from '../../assets/beacon/9.png'
import i10 from '../../assets/beacon/10.png'
import i11 from '../../assets/beacon/11.png'
export default function BeaconImage() {
    const images = [
        i1,
        i2,
        i3,
        i4,
        i5,
        i6,
        i7,
        i8,
        i9,
        i10,
        i11]
    return (
        <View
            style={{
                flex: 1
            }}
        >
            <View
                style={{
                    backgroundColor: '#131313',
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '600'
                    }}
                >
                    Your images
                </Text>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: 'white',
                        borderRadius: 999,
                        padding: 8
                    }}
                >
                    <FontAwesomeIcon icon={faCameraRetro} size={16} color='white' />
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    rowGap: 1,
                    columnGap: 1,
                    flexWrap: 'wrap'
                }}
            >
                <View>
                    <Image
                        source={require('../../assets/beacon/beacon-checkin-image.png')}
                        style={{
                            width: (Dimensions.get('screen').width / 4 - 0.5),
                            height: 93,
                            objectFit: 'cover'
                        }}
                    />
                    <View
                        style={{
                            backgroundColor: '#ccc',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 50,
                            opacity: 0.5
                        }}
                    />
                </View>
                {images.map((item: any, idx: number) => (
                    <Image
                        key={idx}
                        source={item}
                        style={{
                            width: Dimensions.get('screen').width / 4 - 1,
                            height: 93,
                            resizeMode: 'cover'
                        }}
                    />
                ))}
            </View>
        </View>
    )
}
