import React from 'react';
import CheckedinItem from './CheckedinItem';
import { View } from 'react-native';
import DetailCard from './DetailCard';

export default function Feed({
  wrapperData,
  data,
  dataIdx,
  item,
  itemIdx,
}: any) {
  return (
    <>
      {item.type === 'minted' && item.image ? (
        <CheckedinItem
          data={{ ...item }}
          last={
            itemIdx + 1 === data?.length &&
            dataIdx + 1 === Object.entries(wrapperData)?.length
          }
        />
      ) : (
        <View style={{ marginHorizontal: 20 }}>
          <DetailCard
            key={itemIdx}
            data={{ ...item }}
            last={
              itemIdx + 1 === data?.length &&
              dataIdx + 1 === Object.entries(wrapperData)?.length
            }
          />
        </View>
      )}
    </>
  );
}
