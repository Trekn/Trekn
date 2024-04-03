import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuthContext } from '../context/AuthContext';
import Carousel from 'react-native-reanimated-carousel';

export default function SignIn() {
  const { signIn } = useAuthContext();

  const viewList = [
    { uri: require('../assets/images/sign-in-image-1.png') },
    { uri: require('../assets/images/sign-in-image-2.png') },
    { uri: require('../assets/images/sign-in-image-3.png') },
  ];

  const [activeIndex, setActiveIndex] = useState(1);
  const width = Dimensions.get('window').width;

  const titleList = [
    'Sharing local insights has \nnever been easier',
    `Explore like a Local, \nWherever you go `,
    'Connect with your friends \nand earn more together',
  ];

  const descList = [
    'Post your experiences, validated by the local community, and earn rewards for every valuable insight you contribute.',
    'Unlock the secrets of every location with real-time tips and recommendations from locals and fellow travelers.',
    'Invite and connect with friends on Trekn and boost your earnings as you contribute insights together.',
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle={'light-content'} />

      <Carousel
        loop
        width={width - 19}
        height={width - 19}
        // autoPlay={true}
        data={viewList}
        // scrollAnimationDuration={5000}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View style={{}}>
            <Image
              source={item.uri}
              style={{
                width: width - 19,
                height: width - 19,
                resizeMode: 'cover',
                justifyContent: 'center',
              }}
            />
          </View>
        )}
      />

      <View
        style={{
          paddingTop: 29,
          backgroundColor: '#151515',
          paddingHorizontal: 16,
          height: Dimensions.get('screen').height - width + 19,
        }}
      >
        <View style={{}}>
          <Text
            style={{
              color: '#FFF',
              fontFamily: 'Inter',
              fontSize: 24,
              fontWeight: '700',
              lineHeight: 32,
              marginBottom: 16,
            }}
          >
            {titleList[activeIndex]}
          </Text>
          <Text
            style={{
              color: '#FFF',
              fontFamily: 'Inter',
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 24,
              marginBottom: 20,
              height: 72,
            }}
          >
            {descList[activeIndex]}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8,
              marginBottom: 20,
            }}
          >
            {viewList.map((_, index) => (
              <View
                key={index}
                style={{
                  width: index === activeIndex ? 8 : 6,
                  height: index === activeIndex ? 8 : 6,
                  borderRadius: 999,
                  backgroundColor:
                    index === activeIndex
                      ? '#FFF'
                      : 'rgba(255, 255, 255, 0.60)',
                  marginRight: 12,
                  ...(index === viewList.length - 1 && { marginRight: 0 }),
                }}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await signIn('google');
            }}
          >
            <Image source={require('../assets/images/Google.png')} />
            <Text style={styles.button_text}>Continue with Google</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                await signIn('apple');
              }}
            >
              <Image
                source={require('../assets/images/apple.png')}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <Text style={styles.button_text}>Continue with Apple</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderRadius: 117.791,
    borderWidth: 1,
    borderColor: 'rgba(180, 180, 180, 0.30)',
    marginBottom: 16,
  },
  button_text: {
    marginLeft: 12,
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: -0.64,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '800',
    lineHeight: 38.4,
    letterSpacing: -0.118,
    marginBottom: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  okButton: {
    marginTop: 20,
    color: 'blue',
  },
});
