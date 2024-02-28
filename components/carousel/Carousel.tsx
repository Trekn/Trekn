import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { isVideo } from '../../utils/drop.util';
import VideoComponent from '../VideoComponent';
import useAutoPlay from '../../hooks/useAutoplay';
import { Carousel } from 'react-native-basic-carousel';
import { Image } from 'react-native';

export default function CustomCarousel({ data, setCurrentImg }: any) {
  const [muted, setMuted] = useState(true);
  // const videoRef: any = useRef();
  // const carouselRef = useRef(null);
  // useAutoPlay(videoRef);

  return (
    <Carousel
      data={(data.imageArray ? data.imageArray : data?.drop?.imageArray)?.slice(
        0,
        3
      )}
      renderItem={({ item, index }) => (
        <View key={index}>
          {isVideo(item) ? (
            <VideoComponent
              key={index}
              // videoRef={videoRef}
              src={item}
              muted={muted}
            />
          ) : (
            <Image
              source={{ uri: item }}
              alt='Drop Img'
              style={{
                height: '100%',
                objectFit: 'cover',
                width: '100%'
              }}
            />
          )}
          {/* <View
            className='absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 34.71%, rgba(0, 0, 0, 0.40) 77.95%)',
              borderRadius: 12,
            }}
          ></View> */}
        </View>
      )}
      itemWidth={Dimensions.get('screen').width - 40}
      customPagination={({ activeIndex }) => {
        setCurrentImg && setCurrentImg(activeIndex);
        return (
          <View
            style={{
              bottom: 26,
              position: 'absolute',
              right: 20,
              display: 'flex',
              flexDirection: 'row',
              gap: 8,
              zIndex: 50
            }}
          >
            {(data.imageArray ? data.imageArray : data?.drop?.imageArray)
              ?.slice(0, 3)
              .map((item: any, idx: number) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: `${activeIndex === idx ? 'white' : '#D9D9D980'}`,
                    width: 8,
                    height: 8,
                    borderRadius: 999
                  }}
                />
              ))}
          </View>
        );
      }}
    />
  );
}
