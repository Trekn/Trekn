import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { EventProvider } from 'react-native-outside-press';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: 'home',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
    <>
      <SafeAreaView
        style={{
          width: '100%',
          flex: 1,
          // backgroundColor: 'black',
          marginTop: '5%'
        }}>
        <Provider store={store}>
          <AuthProvider>
            <EventProvider>
              <View
                style={{
                  backgroundColor: 'white',
                  flex: 1
                }}>
                <Slot />
              </View>
            </EventProvider>
            <Navbar />
          </AuthProvider>
        </Provider>
      </SafeAreaView>
      {/* <StatusBar barStyle={'light-content'} /> */}
    </>
  );
}
