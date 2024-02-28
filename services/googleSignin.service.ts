import {
  GoogleSignin,
  NativeModuleError,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

export const googleSingin = async () => {
  try {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    });

    await GoogleSignin.hasPlayServices();
    const googleUserInfo = await GoogleSignin.signIn();
    // console.log('Google user info', googleUserInfo);
    if (googleUserInfo.idToken) {
      // console.log('Here');
      const userInfo = {
        name: googleUserInfo.user.name || 'Undefined',
        email: googleUserInfo.user.email,
        profileImage:
          googleUserInfo.user.photo ||
          `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/drop_image/profileImage.svg`,
      };
      return userInfo;
    }
  } catch (error) {
    const typedError = error as NativeModuleError;

    switch (typedError.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        // sign in was cancelled
        Alert.alert("cancelled");
        break;
      case statusCodes.IN_PROGRESS:
        // operation (eg. sign in) already in progress
        Alert.alert("in progress");
        break;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        // android only
        Alert.alert("play services not available or outdated");
        break;
      default:
        Alert.alert("Something went wrong", typedError.toString());
    }
  }
  // Perform sign-in logic here
};
