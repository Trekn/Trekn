import { PostReducer, initialState } from '@/redux/slides/postSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { useReducer } from 'react';
import { PostContext } from '../../../helper/Image';
import { View, Text, TouchableOpacity } from 'react-native';
import MainContainer from '@/components/drop/MainContainer';
import SelectedImage from '@/components/drop/SelectedImage';
import ListPhotos from '@/components/drop/ListPhotos';
import PostHeader from '@/components/drop/PostHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import * as MediaLibrary from 'expo-media-library';

export default function AddImage() {
  const { id: dropId } = useLocalSearchParams();
  const [state, dispatch] = useReducer(PostReducer, initialState);
  const { setMetadata } = useAuthContext();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [latestCursor, setLatestCursor] = useState<MediaLibrary.AssetRef>();
  const [recentAlbumId, setRecentAlbumId] = useState<MediaLibrary.AlbumRef>();

  const askPermissionAndFetchData = async () => {
    if (permissionResponse?.granted) {
      await fetchData();
      setLoaded(true);
    } else {
      const { granted } = await requestPermission();
      if (granted) {
        await fetchData();
        setLoaded(true);
      }
    }
  };

  const fetchData = async () => {
    setIsLoadingMore(true);
    try {
      let id = recentAlbumId;
      if (!initialized) {
        const albums = await MediaLibrary.getAlbumsAsync({
          includeSmartAlbums: true,
        });

        let maxAssetCount = 0;
        let albumWithMaxAssetCount = null;

        for (let i = 0; i < albums.length; i++) {
          if (albums[i].assetCount > maxAssetCount) {
            maxAssetCount = albums[i].assetCount;
            albumWithMaxAssetCount = albums[i];
          }
        }

        if (albumWithMaxAssetCount) {
          setRecentAlbumId(albumWithMaxAssetCount.id);
          id = albumWithMaxAssetCount.id;
        } else {
          console.log('Dont have any album');
          return;
        }
      }

      const media = await MediaLibrary.getAssetsAsync({
        first: 20,
        mediaType: 'photo',
        after: latestCursor,
        album: recentAlbumId || id,
      });

      if (media.assets.length > 0) {
        let payload;

        if (state.media) {
          payload = [...state.media, ...media.assets];
        } else {
          payload = media.assets;
        }

        dispatch({
          type: 'SET_MEDIA',
          payload: [...payload],
        });

        if (!initialized) {
          setMetadata({
            image: media.assets[0],
            imageArray: [media.assets[0]],
          });
          dispatch({ type: 'DEFAULT_IMAGE' });
          setInitialized(true);
        }

        setLatestCursor(media.assets[media.assets.length - 1].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!initialized) {
      askPermissionAndFetchData();
    }
  }, [initialized]);

  const clearUpDataOnUnMount = useCallback((): any => {
    dispatch({
      type: 'EMPTY',
    });
  }, []);

  return (
    <>
      {loaded ? (
        <View
          style={{
            backgroundColor: 'black',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <PostHeader
            headerTitle={'Checkin'}
            onClick={clearUpDataOnUnMount}
            onSuccessClick={() => {
              setMetadata({
                image: state.selectedImagesFromAlbum[0] || state.media[0],
                imageArray: state.selectedImagesFromAlbum[0]
                  ? [state.selectedImagesFromAlbum[0]]
                  : [state.media[0]],
              });

              router.replace(`/check-in/${dropId}`);
            }}
          />
          <PostContext.Provider
            value={{
              state,
              dispatch,
            }}
          >
            <SelectedImage multiple={false} />
            <ListPhotos
              isLoadingMore={isLoadingMore}
              loadMoreData={fetchData}
            />
          </PostContext.Provider>
        </View>
      ) : (
        <>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                await requestPermission();
              }}
              style={{}}
            >
              <Text
                style={{
                  color: 'white',
                }}
              >
                Press to allow
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}
