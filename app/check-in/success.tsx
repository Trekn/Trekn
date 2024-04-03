import { useAuthContext } from '@/context/AuthContext';
import { faCheckCircle, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity, Text, View } from 'react-native';

export default function CheckinSuccess() {
  const { metadata, setMetadata } = useAuthContext();

  const widthScreen = Dimensions.get('screen').width;
  const width = widthScreen - 40 - 32;

  console.log(metadata);
  return (
    <View style={{ backgroundColor: '#000', flex: 1 }}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 90,
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 16,
          }}
        >
          <FontAwesomeIcon icon={faCheckCircle} size={24} color='#9DFF50' />
          <Text
            style={{
              color: '#9DFF50',
              fontSize: 20,
              fontWeight: '500',
              lineHeight: 24,
              marginLeft: 8,
            }}
          >
            + 100pts
          </Text>
        </View>
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.70)',
            fontFamily: 'Work Sans',
            fontSize: 16,
            fontWeight: '500',
            lineHeight: 16, // 16px
            letterSpacing: -0.08,
            marginBottom: 46,
          }}
        >
          Added a new location
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#595959',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 12,
          }}
        >
          <Text
            style={{
              color: '#FFF',
              fontSize: 20,
              fontWeight: '700',
              lineHeight: 40,
              letterSpacing: -0.08,
            }}
          >
            {metadata.name}
          </Text>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.70)',
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 16,
              letterSpacing: -0.08,
              marginBottom: 24,
            }}
            numberOfLines={1}
          >
            {metadata.location}
          </Text>
          <Image
            style={{ width: width, height: width }}
            source={{
              uri: metadata.image.uri,
            }}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 59,
          borderTopWidth: 1,
          borderTopColor: '#595959',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#2E2E2E',
              borderRadius: 24,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              width: widthScreen * 0.234,
            }}
          >
            <FontAwesomeIcon icon={faShare} size={24} color='#FFFFFFB2' />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#2E2E2E',
              borderRadius: 24,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              width: widthScreen * 0.6266,
            }}
            onPress={() => {
              setMetadata({});
              router.replace('/');
            }}
          >
            <Text
              style={{
                color: '#FFF',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                lineHeight: 24,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
