import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import DetailCard from './DetailCard';
import HomeItem from './home/HomeItem';

export default function ListDetail({
  data,
  status,
  isEnd,
}: {
  data: any;
  status: any;
  isEnd: boolean;
}) {
  const [amountShowItem, setAmountShowItem] = useState(6);

  const handleShowMore = () => {
    if (data?.length === 0) return;
    if (amountShowItem + 3 >= data.length) {
      setAmountShowItem(data?.length);
    } else {
      setAmountShowItem(amountShowItem + 3);
    }
  };

  const isShowShowMore = useMemo(() => {
    return data?.length > 0 && amountShowItem < data?.length;
  }, [amountShowItem, data]);

  useEffect(() => {
    if (isEnd) {
      handleShowMore();
    }
  }, [isEnd]);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 20,
        marginBottom: data?.length <= amountShowItem ? 180 : 0
      }}
    >
      {data?.slice(0, amountShowItem).map((item: any, index: any) => (
        <View key={index}>
          <HomeItem data={item} />
        </View>
      ))}
    </View>
  );
}
