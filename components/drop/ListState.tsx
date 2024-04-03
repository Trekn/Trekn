import { useContext } from 'react';
import { PostContext } from '../../helper/Image';

const ListState = () => {
  const { state, dispatch } = useContext(PostContext);

  const selectedImagesFromAlbum = (asset: any) => {
    if (state.selectedImagesFromAlbum.includes(asset)) {
      dispatch({ type: 'REMOVE_IMAGE', payload: asset });
    } else if (!state.multiple) {
      dispatch({
        type: 'ADD_IMAGE',
        payload: {
          asset,
          multiple: state.multiple,
        },
      });
    } else {
      dispatch({
        type: 'ADD_IMAGE',
        payload: { asset, multiple: state.multiple },
      });
    }
  };
  return [state, dispatch, selectedImagesFromAlbum];
};

export default ListState;
