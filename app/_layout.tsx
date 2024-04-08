import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { StatusBar, View } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { EventProvider } from 'react-native-outside-press';

export { ErrorBoundary } from 'expo-router';

import { Appearance } from 'react-native';

//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Phật phù hộ, không bao giờ BUG
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SplashScreen.preventAutoHideAsync();
// LogBox.ignoreAllLogs();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  Appearance.setColorScheme('light');
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <Provider store={store}>
          <AuthProvider>
            <EventProvider>
              <Slot />
            </EventProvider>
            <Navbar />
          </AuthProvider>
        </Provider>
      </View>
      <StatusBar barStyle={'light-content'} />
    </>
  );
}
