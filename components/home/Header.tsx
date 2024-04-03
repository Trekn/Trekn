import { faPlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Linking, Image, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function Header() {
  const user: any = useSelector((state: any) => state.user)
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 24, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#0000000D' }}>
      <Text style={{ fontSize: 28, fontWeight: '700', letterSpacing: -0.08 }}>
        Trekn
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 16
        }}
      >
        <View
          style={{
            backgroundColor: 'black',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8
          }}
        >
          <Image
            source={require('../../assets/icon/header-point.png')}
            style={{
              width: 24,
              height: 24
            }} />
          <Text
            style={{
              color: 'white'
            }}
          >{user.point}</Text>
        </View>
        <Pressable
        onPress={()=>router.replace('/addfriend')}
        >
          <FontAwesomeIcon icon={faUserPlus} size={24} />
        </Pressable>
      </View>
    </View>
  );
}
