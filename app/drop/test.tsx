import React, { useCallback, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';

export default function AddPost() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  console.log('Permission respone', permissionResponse);

  const something = async () => {
    const a = await requestPermission();
    console.log('1', a);
  };
  useEffect(() => {
    something();
  }, []);

  return (
    <>
      <Pressable
        onPress={async () => {
          const a = await MediaLibrary.getAssetsAsync({
            mediaType: 'photo',
          });

          console.log(a);

          router.replace('/');

          //   const a = await MediaLibrary.getAlbumsAsync({
          //     includeSmartAlbums: true,
          //   });
          //   console.log(a);
          //   console.log(a.length);
          //   for (let i = 0; i < a.length; i++) {
          //     console.log(a[i].title);
          //   }

          //   const b = await MediaLibrary.getAlbumAsync('Instagram')
          //   console.log(b);
        }}
      >
        <Text>Press!</Text>
      </Pressable>
    </>
  );
}
