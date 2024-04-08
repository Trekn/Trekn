import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, TouchableOpacity, Text, View, StatusBar, Animated, ScrollView } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useSelector } from 'react-redux'
import { getAllDrops, getDropType, getNearByDrop } from '../middleware/data/drop'
import { router } from 'expo-router'
import { Circle, G, Svg } from 'react-native-svg'
import CustomDrawer from '../components/CustomDrawer'
import { Image } from 'expo-image'
import CustomCarousel from '../components/carousel/Carousel'
import { capitalizeFirstLetter, formatLocation } from '../functions/text'
import ListDetail from '@/components/ListDetail'
import LoadingSpinner from '@/components/LoadingSpinner'
import Detail from '@/components/drop/Detail'
import Constants from 'expo-constants'

export default function MapViewPage() {
  const user = useSelector((state: any) => state.user);
  const typeList = useSelector((state: any) => state.config?.dropType);
  const [locations, setLocations] = useState<any[]>([]);
  const [nearBy, setNearBy] = useState<any[]>([]);
  const [listView, setListView] = useState<any[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [currentView, setCurrentView] = useState('map');
  const [isEnd, setIsEnd] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');


  const handleScroll = (event: any) => {
    const windowHeight = event.nativeEvent.layoutMeasurement.height;
    const documentHeight = event.nativeEvent.contentSize.height;
    const scrollTop = event.nativeEvent.contentOffset.y;
    if (windowHeight + scrollTop >= documentHeight - 20) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }

    if (scrollTop > 147 && !showAdd) {
      return setShowAdd(true);
    }
    if (scrollTop < 147) {
      return setShowAdd(false);
    }
  };

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
    if (filter !== 'all') {
      const result = [...nearBy].filter(
        (item: any) => item.type === filter
      );
      setListView(result);
    } else {
      setListView(nearBy);
    }
  }, [filter]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // await getAllDrops({
      //   onSuccess: (data: any) => {
      //     if (!deepEqual(data, locations)) {
      //       setLocations(data);
      //     }
      //   },
      // });

      const { lng, lat } = user
      const data = await getNearByDrop({ lat, lng });
      console.log(data[0])
      setListView(data);
      setNearBy(data);
      setLoading(false);
    })()
  }, [locations]);

  return (
    <View
      style={{
        position: 'relative',
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        marginTop: Constants.statusBarHeight
      }}>
      {loading ?
        <LoadingSpinner />
        :
        <>
          <View
            style={{
              position: 'absolute',
              top: 20,
              zIndex: 50,
              left: 20,
              right: 20,
              backgroundColor: '#F0F0F0',
              borderRadius: 10
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 4,
              }}>
              <TouchableOpacity
                onPress={() => setCurrentView('map')}
                style={{
                  width: '50%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  backgroundColor: currentView === 'map' ? 'white' : 'transparent',
                  borderRadius: currentView === 'map' ? 10 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                >
                  Map view
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentView('list')}
                style={{
                  width: '50%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  backgroundColor: currentView === 'list' ? 'white' : 'transparent',
                  borderRadius: currentView === 'list' ? 10 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}>
                  List view
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {currentView === 'map' ?
            <>
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
                  marginTop: -Constants.statusBarHeight
                }}
              // minZoomLevel={14}
              >
                {listView.map((location, index) => (
                  <Marker
                    key={index}
                    coordinate={{ longitude: location.lng, latitude: location.lat }}
                  >
                    <TouchableOpacity onPress={() => {
                      setSelectedLocation(location);
                      setIsDrawerVisible(true);
                    }}>
                      <Image
                        source={require('../assets/icon/map-marker-icon.png')}
                        style={{
                          width: 32,
                          height: 32,
                          objectFit: 'cover'
                        }}
                        contentFit='cover'
                      />
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
              {
                selectedLocation && (
                  <CustomDrawer
                    isOpen={isDrawerVisible}
                    onClose={() => setIsDrawerVisible(false)}
                    style={{
                      height: '60%',
                      borderRadius: 24
                    }}
                  >
                    <Detail dropData={selectedLocation} />
                  </CustomDrawer>
                )
              }
            </>
            :
            <ScrollView
              scrollEventThrottle={16}
              onScroll={handleScroll}
              style={{
                flex: 1,
                marginTop: 60,
                padding: 20
              }}
            >
              <View style={{ marginBottom: 24, height: 34, marginTop: 4 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 5 }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: filter === 'all' ? '#99FF48' : '#F2F2F2',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12
                    }}
                    onPress={() => setFilter('all')}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: filter === 'all' ? '#020303' : '#707070',
                        fontWeight: '500',
                        lineHeight: 18,
                        letterSpacing: -0.08,
                      }}
                      numberOfLines={1}
                    >
                      {user.city ?
                        `All in ${user.city}`
                        :
                        'Population'
                      }
                    </Text>
                  </TouchableOpacity>
                  {typeList?.map((item: any, idx: number) => (
                    <TouchableOpacity
                      key={idx}
                      style={{
                        backgroundColor: filter === item.id ? '#99FF48' : '#F2F2F2',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12
                      }}
                      onPress={() => setFilter(item.id)}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: filter === item.id ? '#020303' : '#707070',
                          fontWeight: '500',
                          lineHeight: 18,
                          letterSpacing: -0.08,
                        }}
                        numberOfLines={1}
                      >
                        {capitalizeFirstLetter(item.type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <ListDetail status={'Nearby'} data={listView} isEnd={isEnd} />
            </ScrollView>
          }
        </>
      }

    </View >
  )
}
