import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { LinearGradient } from 'expo-linear-gradient';

export default function Discovery({
  viewList,
  handleScrollDown,
}: {
  viewList: any[];
  handleScrollDown: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(1);
  const carouselRef = useRef<Carousel<any> | null>(null);

  const width = Dimensions.get('window').width - 64;

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* <Pressable
        style={{ justifyContent: 'center', alignItems: 'center' }}
        onPress={() => {
          router.replace(`/check-in/add-image/${item.id}`);
        }}
      > */}
      <Image
        style={{ height: width + 2, width: width, borderRadius: 24 }}
        source={{ uri: item.image }}
      />
      <View
        style={{
          position: 'absolute',
          zIndex: 999,
          top: 20,
          backgroundColor: 'white',
          borderRadius: 24,
          paddingVertical: 4,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: '#000',
          borderStyle: 'solid',
        }}
      >
        <Text>{item.name}</Text>
      </View>
      {/* </Pressable> */}
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: Dimensions.get('screen').height - 215,
      }}
    >
      {viewList && viewList.length > 0 ? (
        <>
          <View
            style={{
              marginTop: 20,
              marginBottom: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                fontSize: 28,
                fontWeight: '600',
                marginBottom: viewList?.length > 1 ? 24 : 0,
                maxWidth: 242
              }}
            >
              Discover new places today?
            </Text>

            {viewList?.length > 1 &&
              <Text
                style={{
                  color: 'rgba(0, 0, 0, 0.70)',
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: 24,
                }}
              >
                Swipe to find your spot
              </Text>
            }
          </View>
          <View>
            <Carousel
              layout={'default'}
              ref={carouselRef}
              data={viewList}
              renderItem={renderItem}
              onSnapToItem={(index) => setActiveIndex(index)}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={width}
              inactiveSlideShift={0}
              loop={true}
            />
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#99FF48',
              padding: 16,
              borderRadius: 999,
              marginHorizontal: 20,
              marginTop: 24,
              marginBottom: 20,
            }}
            onPress={() => {
              router.replace(
                `/check-in/add-image/${viewList[activeIndex - 1].id}`
              );
            }}
          >
            <Text
              style={{
                color: '#16171E',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: 18,
              }}
            >
              Check In & Earn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              columnGap: 8,
              padding: 9
            }}
            onPress={() => {
              router.replace(
                `/drop/add-post`
              );
            }}
          >
            <FontAwesomeIcon icon={faPlus}/>
            <Text
              style={{
                color: '#16171E',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: 18,
              }}
            >
              Add a new spot
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 12,
            marginTop: 70,
            marginBottom: 40,
            height: 468,
          }}
        >
          <LinearGradient
            colors={['#99FF48', '#62DE01']}
            style={{
              borderRadius: 24,
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingTop: 40,
              width: '100%',
              height: '100%',
            }}
          >
            <Image
              source={require('../../assets/old-image/geotag.png')}
              style={{
                marginBottom: 24,
              }}
            />

            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                fontSize: 28,
                fontWeight: '600',
                marginBottom: 24,
                marginHorizontal: 66,
              }}
            >
              Discover new places today?
            </Text>
            <Text
              style={{
                color: 'rgba(0, 0, 0, 0.70)',
                textAlign: 'center',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: 24,
                marginBottom: 24,
                width: '80%',
              }}
            >
              Found a hidden gem? Be the first to share an insight nearby and
              earn a reward!
            </Text>

            <TouchableOpacity
              style={{
                height: 50,
                width: '100%',
                borderRadius: 999,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => router.replace('/drop/add-post')}
            >
              <Text
                style={{
                  color: '#16171E',
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '600',
                  lineHeight: 18,
                }}
              >
                Add a new insight
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 'auto',
          marginBottom: 32,
        }}
        onPress={handleScrollDown}
      >
        <FontAwesomeIcon icon={faChevronDown} size={24} color='#2B2B2BB2' />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
