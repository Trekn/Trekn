import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TextComponent from './TextComponent';
import IconComponent from './Icon';
import Media, { PostContext, lauchCamera } from '../../helper/Image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faCopy } from '@fortawesome/free-solid-svg-icons';

const SelectedImage = ({ multiple = true }: { multiple?: boolean }) => {
  const { state, dispatch } = useContext(PostContext);

  const getPhotoFromCamera = async () => {
    const photoDetail = await lauchCamera();
    // // console.log(photoDetail, 6);
    if (photoDetail) {
      if (photoDetail?.cancelled) {
        console.log('cancelled');
        return;
      }
      if (!photoDetail?.cancelled && photoDetail?.assets) {
        console.log('Add image');

        dispatch({
          type: 'ADD_IMAGE',
          payload: {
            asset: photoDetail.assets[0],
            multiple: false,
          },
        });
      }
    }
  };
  return (
    <>
      {(state.selectedImagesFromAlbum || state.selectedImage) && (
        <View style={styles.Selected_Image}>
          <Image
            source={{
              uri:
                state.selectedImagesFromAlbum[
                  state.selectedImagesFromAlbum.length - 1
                ]?.uri ||
                state.selectedImage[state.selectedImage.length - 1]?.uri,
              //   isStatic: true,
            }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        </View>
      )}

      <View style={styles.SelectedImage_Container}>
        <TouchableOpacity onPress={() => {}}>
          <View
            style={{
              height: 32,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <TextComponent style={styles.Set_Album_Name}>
              Your images
            </TextComponent>
          </View>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            onPress={() => dispatch({ type: 'SET_MULTIPLE_IMAGE' })}
          >
            {multiple && (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  backgroundColor: state.multiple ? '#99FF48' : 'black',
                  borderWidth: 1,
                  borderColor: state.multiple ? '#99FF48' : 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon
                  icon={faCopy}
                  size={16}
                  color={state.multiple ? 'black' : 'white'}
                />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingLeft: 20,
            }}
            onPress={getPhotoFromCamera}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                backgroundColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'white',
              }}
            >
              <FontAwesomeIcon icon={faCamera} size={16} color='white' />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default React.memo(SelectedImage);

const styles = StyleSheet.create({
  Selected_Image: {
    width: '100%',
    height: '50%',
    overflow: 'scroll',
  },
  Set_Album_Name: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  SelectedImage_Container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  Camera_Container: {
    flexDirection: 'row',
    paddingRight: 20,
  },
});
