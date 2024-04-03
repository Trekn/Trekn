import React, { Fragment, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UploadImage() {
  const { metadata, setMetadata } = useAuthContext();
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>(metadata.imageArray || []);
  const arrays = Array.from({ length: 9 });
  const [isLoading, setIsLoading] = useState(false);

  const pickImageAsync = async () => {
    setIsLoading(true);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 9,
    });

    if (!result.canceled) {
      setImages((prev: any) => {
        if (result.assets) {
          return [...prev, ...result?.assets]
        }
        return [...prev];
      });
    }
    setIsLoading(false);
  };
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: Dimensions.get('screen').height - (StatusBar.currentHeight || 40)
        }}
      >
        <ActivityIndicator size={'large'} color={'#FFF'} />
        <Text
          style={{
            marginTop: 12,
            color: '#FFF',
            fontSize: 16,
          }}
        >
          Loading image...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        paddingVertical: 30, paddingHorizontal: 20,
        backgroundColor: '#000000',
        flex: 1,
        alignItems: 'center',
        position: 'relative',
        minHeight: Dimensions.get('screen').height - (StatusBar.currentHeight || 40)
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 82,
        }}
      >
        <Pressable
          style={{ position: 'absolute', zIndex: 50 }}
          onPress={() => {
            router.replace('/');
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={16}
            color='#FFFFFFB2'
          />
        </Pressable>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Add location images
        </Text>
      </View>

      <View
        style={{
          backgroundColor: '#1E1E1E',
          width: '100%',
          borderRadius: 12,
          padding: 24,
          flexDirection: 'column',
          alignContent: 'center',
        }}
      >
        {images.length > 0 ? (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 12
              }}
            >
              {arrays.map((_: any, index: number) => (
                <Fragment key={index}>
                  {images[index] !== undefined ? (
                    <Image
                      style={{
                        height: 93,
                        width: '30.7%',
                        borderRadius: 12,
                        resizeMode: 'cover',
                      }}
                      source={{ uri: `${images[index].uri}` }}
                    />
                  ) : (
                    <Pressable
                      key={index}
                      style={{
                        height: 93,
                        width: '30.7%',
                        backgroundColor: '#252525',
                        borderRadius: 12,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        console.log(index);
                        pickImageAsync();
                      }}
                    >
                      <FontAwesomeIcon
                        key={index}
                        icon={faPlus}
                        color='#FFFFFFB2'
                        size={16}
                      />
                    </Pressable>
                  )}
                </Fragment>
              ))}
            </View>
            <Text
              onPress={() => { }}
              style={{
                color: '#99FF48',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                lineHeight: 24,
              }}
            >
              Edit
            </Text>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                marginHorizontal: 24,
              }}
            >
              <View
                style={{
                  width: 177,
                  height: 209,
                  marginTop: 15,
                  transform: [{ rotate: '10.868deg' }],
                  flexShrink: 0,
                }}
              >
                <Image
                  style={{
                    resizeMode: 'cover',
                    height: 200,
                    width: 169,
                  }}
                  source={require('../../assets/old-image/photo_with_image.png')}
                />
              </View>
            </View>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.70)',
                textAlign: 'center',
                letterSpacing: -0.08,
                marginTop: 10,
                fontSize: 13,
                lineHeight: 18.2,
              }}
            >
              Upload images or video to give others a vivid and detailed view of
              this place.
            </Text>
          </>
        )}
      </View>

      <Pressable
        style={{
          display: 'flex',
          width: '100%',
          height: 48,
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
          borderRadius: 24,
          backgroundColor: '#2E2E2E',
          bottom: 40,
          position: 'absolute',
        }}
        onPress={() => {
          if (images.length > 0) {
            setMetadata({
              ...metadata,
              image: images[0],
              imageArray: images,
            });
            router.replace('/drop/edit-location');
          } else {
            pickImageAsync();
          }
        }}
      >
        <Text
          style={{
            color: '#FFF',
            textAlign: 'center',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 24,
          }}
        >
          {images.length > 0 ? 'Continue' : 'Upload image or video'}
        </Text>
      </Pressable>
    </View>
  );
}
