import {
  GoogleSignin,
  NativeModuleError,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '../utils/supabaseClients';
import { updateUser } from '../redux/slides/userSlides';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';

export const googleSingin = async () => {
  try {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        "449665684562-jj11q0bso436i17kimsk67e0hg2qfh8q.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
    });

    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('Google user info', userInfo);
    if (userInfo.idToken) {
      console.log('Here');

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.idToken,
      });

      console.log(error);

      if (error) {
        return { error: "Cannot login" };
      }
      return {};
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
