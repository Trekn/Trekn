import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import TextComponent from './TextComponent';
import UseListState from './ListState';
import styles from './List.styles';

const Photos = ({ item }: { item: any }) => {
  const [state, dispatch, selectedImagesFromAlbum] = UseListState();

  return (
    <>
    
      <TouchableOpacity
        style={{ position: 'relative' }}
        onPress={() => selectedImagesFromAlbum(state.media[item])}
        onLongPress={() => dispatch({ type: 'SET_MULTIPLE_IMAGE' })}
      >
        <Image
          source={{
            uri: state.media[item].uri,
          }}
          style={styles.Image}
        />

        <View
          style={[
            styles.Selected_Image,
            {
              backgroundColor: state.selectedImagesFromAlbum.includes(
                state.media[item]
              )
                ? 'rgba(255,255,255,0.40);'
                : 'transparent',
            },
          ]}
        />
        {state.multiple && (
          <View
            style={[
              styles.Selected,
              {
                backgroundColor:
                  state.selectedImagesFromAlbum.indexOf(state.media[item]) >= 0
                    ? '#99FF48'
                    : '#292b2c',
                borderColor: 'white',
                borderWidth: 2,
              },
            ]}
          >
            <TextComponent style={styles.Text}>
              {state.selectedImagesFromAlbum.indexOf(state.media[item]) >= 0
                ? state.selectedImagesFromAlbum.indexOf(state.media[item]) + 1
                : ''}
            </TextComponent>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

export default Photos;