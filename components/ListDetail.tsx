import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import DetailCard from './DetailCard';
import HomeItem from './home/HomeItem';
import { router } from 'expo-router';

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
    <>
      {data?.length > 0 ?
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
          ))
          }
        </View>
        :
        <View
          style={{
            height: Dimensions.get('screen').height - 300,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            rowGap: 16
          }}
        >
          <Image source={require('../assets/images/spyglass.png')}
            style={{
              width: 158,
              height: 158
            }} />
          <Text
          style={{
            textAlign: 'center',
            paddingHorizontal: 50,
            fontSize: 13,
            lineHeight: 14,
            color: '#00000070'
          }}
          >
            No place found in this category. Let’s add your new discovery
          </Text>
          <TouchableOpacity
          style={{
            backgroundColor: '#99FF48',
            paddingVertical: 16,
            width: '100%',
            borderRadius: 999
          }}
          onPress={()=>router.replace('/drop/add-post')}
          >
            <Text
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 16,
              lineHeight: 18
            }}
            >
              Add a new spot
            </Text>
          </TouchableOpacity>
        </View>
      }
    </>
  );
}
