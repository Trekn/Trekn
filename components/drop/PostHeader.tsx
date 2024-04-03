import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';

const PostHeader = ({
  onClick,
  headerTitle,
  onSuccessClick,
}: {
  onClick?: any;
  headerTitle?: any;
  route?: any;
  onSuccessClick?: any;
}) => {
  const handleCancelButton = () => {
    onClick();
    router.replace('/');
  };

  return (
    <SafeAreaView style={{}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 4,
          paddingHorizontal: 16,
          height: 48,
        }}
      >
        <Pressable onPress={handleCancelButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={16} color='#FFFFFFB2' />
        </Pressable>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            flex: 1,
          }}
        >
          {headerTitle}
        </Text>

        <TouchableOpacity onPress={onSuccessClick}>
          <Text style={{ color: '#99FF48', fontSize: 16, fontWeight: '600' }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostHeader;
