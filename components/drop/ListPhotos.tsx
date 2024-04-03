import React, { useContext, useMemo } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { PostContext } from '../../helper/Image';
import PhotoList from './List';

const ListPhotos = ({
  loadMoreData,
  isLoadingMore,
}: {
  loadMoreData: () => void;
  isLoadingMore: boolean;
}) => {
  const { state } = useContext(PostContext);

  return useMemo(
    () => (
      <>
        {state.media && (
          <FlatList
            columnWrapperStyle={{
              flexWrap: 'wrap',
              width: '100%',
            }}
            data={Object.keys(state.media)}
            renderItem={({ item }) => <PhotoList item={item} />}
            keyExtractor={(item) => item}
            numColumns={4}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isLoadingMore ? <ActivityIndicator /> : null
            }
          />
        )}
      </>
    ),
    [state.media]
  );
};

export default ListPhotos;
