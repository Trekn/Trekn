import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 24, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#0000000D' }}>
      <Text style={{ fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing: -0.08 }}>
        Checking in to earn 100 points
      </Text>
      <Pressable onPress={async () => {
        router.replace('/check-in/nearby');
      }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#99FF48', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faPlus} size={16} />
      </Pressable>
    </View>
  );
}
