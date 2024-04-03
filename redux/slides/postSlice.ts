import Media from '../../helper/Image';
import * as MediaLibrary from 'expo-media-library';

export const initialState: any = {
  media: [],
  albumName: '',
  selectedImage: [],
  albumList: [],
  modalVisible: false,
  multiple: false,
  selectedImagesFromAlbum: [],
};

export const mediaList = (albumList: any) => {
  // const setAlbumList: any = {};
  // albumList.forEach((photos: any) => {
  //   setAlbumList[photos.id] = photos.uri;
  // });
  // return setAlbumList;
  return albumList;
};

export const setDefaultImage = (state: any) => {
  const getPhotos = state;
  const defaultPhoto = [getPhotos[Object.keys(getPhotos)[0]]];
  return defaultPhoto;
};

export const getAllAlbumNames = (albums: any) => {
  const listOfAlbums = albums.map((album: any) => album.title);
  return listOfAlbums;
};

export const setSelectedImageFromALbumName = async (album: any) => {
  const getAlbumName = await MediaLibrary.getAlbumAsync(album);
  const photoFromAlbum = await MediaLibrary.getAssetsAsync({
    album: getAlbumName.title,
  });

  return photoFromAlbum.assets;
};

export const addImage = (payload: any, state: any) => {
  let updatedPhotoArray = [];
  if (!payload.multiple) {
    updatedPhotoArray = [payload.asset];
  } else {
    updatedPhotoArray = [...state.selectedImagesFromAlbum, payload.asset];
  }

  return { updatedPhotoArray, media: state.media };
};

export const removeImage = (asset: any, state: any) => {
  const getAllPhotos = state.selectedImagesFromAlbum;
  const updatedPhotos = getAllPhotos.filter((uri: any) => uri !== asset);
  return updatedPhotos;
};

export const IsMultiple = (state: any) => {
  if (state.multiple) {
    return [];
  }
  return state.selectedImagesFromAlbum;
};

export const PostReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'GET_ALBUM_LIST':
      return {
        ...state,
        albumList: getAllAlbumNames(action.payload),
      };
    case 'SET_MEDIA':
      return {
        ...state,
        media: action.payload,
      };
    case 'DEFAULT_IMAGE':
      return {
        ...state,
        selectedImage: setDefaultImage(state.media),
      };
    case 'SET_ALBUM_NAME':
      return {
        ...state,
        albumName: action.payload,
        media: setSelectedImageFromALbumName(action.payload),
        selectedImage: setDefaultImage(state.media),
      };
    case 'MODAL':
      return {
        ...state,
        modalVisible: !state.modalVisible,
      };
    case 'EMPTY':
      return initialState;
    case 'SET_MULTIPLE_IMAGE':
      return {
        ...state,
        multiple: !state.multiple,
        selectedImagesFromAlbum: IsMultiple(state),
      };
    case 'ADD_IMAGE':
      return {
        ...state,
        multiple: action.payload.multiple,
        selectedImagesFromAlbum: addImage(action.payload, state)
          .updatedPhotoArray,
      };
    case 'REMOVE_IMAGE':
      return {
        ...state,
        selectedImagesFromAlbum: removeImage(action.payload, state),
      };
    default:
      return state;
  }
};
