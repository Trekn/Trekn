import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import DetailCard from '../DetailCard';

export default function ListHome({
  data,
  status,
  isEnd,
}: {
  data: any;
  status: any;
  isEnd: boolean;
}) {
  const [amountShowItem, setAmountShowItem] = useState(3);

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
        marginBottom: 16,
      }}
    >
      {data?.slice(0, amountShowItem).map((item: any, index: any) => (
        <View key={index}>
          <DetailCard
            data={item}
            status={status}
            last={
              data.length < amountShowItem
                ? index + 1 === data.length
                : index + 1 === amountShowItem
            }
          />
        </View>
      ))}
    </View>
  );
}
