import { createContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import { Camera } from 'expo-camera';

export const PostContext = createContext({} as any);

const getPhotos = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Baba');
    return [];
  }

  const { assets } = await MediaLibrary.getAssetsAsync({
    first: 20, // Số lượng ảnh muốn lấy
    mediaType: ['photo'], // Chỉ lấy ảnh, không lấy video
  });
  return assets;
};

export const lauchCamera = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }

  const { canceled, assets } = await ImagePicker.launchCameraAsync({
    mediaTypes: MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 5],
    videoMaxDuration: 120,
    quality: 0.9,
  });

  if (assets) {
    return {
      cancelled: canceled,
      assets: assets,
    };
  }
};

const getCameraRollPermission = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
};

const askCameraRollPermission = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
};

export default {
  getPhotos,
  lauchCamera,
  getCameraRollPermission,
  askCameraRollPermission,
};
