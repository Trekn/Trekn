import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useEffect, useState } from 'react'
import { Dimensions, TouchableOpacity, Text, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useSelector } from 'react-redux'
import { getAllDrops } from '../middleware/data/drop'
import { router } from 'expo-router'
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Circle, Defs, G, Svg, Path, Stop, LinearGradient } from 'react-native-svg'
import CustomDrawer from '../components/CustomDrawer'
import { Image } from 'expo-image'
import CustomCarousel from '../components/carousel/Carousel'
import { formatLocation } from '../functions/text'

export default function MapViewPage() {
  const user = useSelector((state: any) => state.user);
  const [locations, setLocations] = useState<any[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) {
      return true;
    }

    if (
      typeof obj1 !== 'object' ||
      obj1 === null ||
      typeof obj2 !== 'object' ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    getAllDrops({
      onSuccess: (data: any) => {
        if (!deepEqual(data, locations)) {
          setLocations(data);
        }
      },
    });
  }, [locations]);
  return (
    <View 
    style={{
      position: 'relative',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height
    }}>
      <TouchableOpacity
        onPress={() => {
          router.replace('/');
        }}
        style={{
          padding: 0,
          zIndex: 1000,
          position: 'absolute',
          backgroundColor: 'black',
          top:20,
          right: 20,
          borderRadius: 999,
          width: 36,
          height: 36,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FontAwesomeIcon icon={faHome} size={16} color='white' />
      </TouchableOpacity>
      <MapView
        initialRegion={{
          latitude: user.lat,
          longitude: user.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{
          height: '100%',
          position: 'relative',
        }}
        minZoomLevel={14}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{ longitude: location.lng, latitude: location.lat }}
          >
            <TouchableOpacity onPress={() => {
              setSelectedLocation(location);
              setIsDrawerVisible(true);
            }}>
              <Svg
                width='39'
                height='43'
                viewBox='0 0 39 43'
                fill='none'
                key={index}
              >
                <Path
                  d='M17.2293 40.454L17.2301 40.4551C18.2734 41.9623 20.5041 41.9624 21.5475 40.4551L21.5483 40.454C23.4911 37.6374 25.16 35.2599 26.5897 33.2231C29.1891 29.5197 30.998 26.9427 32.2259 24.901C33.1877 23.3017 33.8237 21.9835 34.2139 20.6657C34.606 19.3418 34.7383 18.0579 34.7383 16.5416C34.7383 8.06431 27.8661 1.19213 19.3888 1.19213C10.9115 1.19213 4.0393 8.06431 4.0393 16.5416C4.0393 18.0579 4.17159 19.3418 4.56366 20.6657C4.9539 21.9835 5.58994 23.3017 6.55174 24.901C7.77963 26.9427 9.58849 29.5197 12.1879 33.2231C13.6176 35.2599 15.2865 37.6375 17.2293 40.454ZM24.6399 16.5416C24.6399 19.4418 22.2889 21.7928 19.3888 21.7928C16.4887 21.7928 14.1377 19.4418 14.1377 16.5416C14.1377 13.6415 16.4887 11.2905 19.3888 11.2905C22.2889 11.2905 24.6399 13.6415 24.6399 16.5416Z'
                  fill='url(#paint0_linear_567_4001)'
                  stroke='#395324'
                  strokeWidth='1.61574'
                />
                <Defs>
                  <LinearGradient
                    id='paint0_linear_567_4001'
                    x1='19.3888'
                    y1='2'
                    x2='19.3888'
                    y2='40.7777'
                    gradientUnits='userSpaceOnUse'
                  >
                    <Stop stopColor='#99FF48' />
                    <Stop offset='1' stopColor='#D7FFB7' />
                  </LinearGradient>
                </Defs>
              </Svg>
            </TouchableOpacity>
          </Marker>
        ))}
        <Marker
          coordinate={{
            latitude: !user.lat ? 21.0278 : user.lat,
            longitude: !user.lng ? 105.8342 : user.lng,
          }}
        >
          <Svg
            width='36'
            height='35'
            viewBox='0 0 36 35'
            fill='none'
          >
            <G filter='url(#filter0_d_69_1943)'>
              <Circle
                cx='17.9233'
                cy='12.5063'
                r='6.86955'
                fill='#1657FF'
              />
              <Circle
                cx='17.9233'
                cy='12.5063'
                r='9.44104'
                stroke='white'
                strokeWidth='5.14298'
              />
            </G>
          </Svg>
        </Marker>
      </MapView>
      {selectedLocation && (
        <CustomDrawer
          isOpen={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
        >
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Image
                source={{ uri: selectedLocation.user.profileImage }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }}
              />
              <Text style={{ fontWeight: '500', fontSize: 15, lineHeight: 15, color: '#848484' }}>{selectedLocation.user.name}</Text>
            </View>
            <Text style={{ fontWeight: '600', fontSize: 24, lineHeight: 24, color: 'black', marginBottom: 8 }}>
              {selectedLocation?.name}
            </Text>
            <Text 
            style={{
              lineHeight: 16,
              color: '#02030380',
              fontWeight: '500',
              fontSize: 13,
              marginBottom: 16
            }}>
              {formatLocation(selectedLocation.location)}
            </Text>
            <View style={{ position: 'relative', height: 399, width: '100%' }}>
              {selectedLocation?.drop?.imageArray || selectedLocation?.imageArray ?
                <CustomCarousel data={selectedLocation} />
                :
                <Image
                  source={{ uri: selectedLocation?.image || selectedLocation?.drop?.image }}
                  alt='Drop Img'
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 12,
                  }}
                />
              }
            </View>
          </>
        </CustomDrawer>
      )}
      <TouchableOpacity
        onPress={() => {
          router.replace('/check-in/nearby');
        }}
        style={{
          marginLeft: Math.round((Dimensions.get('screen').width - 64) / 2),
          zIndex: 1000,
          position: 'absolute',
          backgroundColor: 'black',
          bottom: 64,
          borderRadius: 999,
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16
        }}
      >
        <FontAwesomeIcon icon={faPlus} color='white' size={24} />
      </TouchableOpacity>
    </View>
  )
}
