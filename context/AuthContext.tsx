import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IDrop } from '../models/types';
import {
  getUserAccountData,
  insertUser,
  isUserIsExisted,
  linkWallet,
} from '../middleware/data/user';
import { now } from 'moment';
import {
  resetUser,
  updateCoordinate,
  updateInit,
  updateUser,
} from '../redux/slides/userSlides';
import { getDropByUserAddress, getDropType } from '../middleware/data/drop';
import { useDispatch, useSelector } from 'react-redux';
import useApi from '../hooks/useAPI';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useStorageState } from '../functions/useStorageState';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../utils/supabaseClients';
import { clearAccountData } from '../redux/slides/accountSlice';
import { setDropType } from '../redux/slides/configSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;
import { Alert, StyleSheet, Text, View } from 'react-native';
import { PublicKey } from '@solana/web3.js';
import { COLORS, BASE_URL } from '../constants';
import * as Linking from 'expo-linking';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { decryptPayload, encryptPayload } from '@/components/PhantomButton';
import * as AppleAuthentication from 'expo-apple-authentication';
import { googleSingin } from '@/functions/googleSignin';

export const AuthContext = createContext({} as AuthContextProps);
export const useAuthContext = () => useContext(AuthContext);

export const buildUrl = (path: string, params: URLSearchParams) =>
  `${BASE_URL}${path}?${params.toString()}`;

const onConnectRedirectLink = Linking.createURL('account/0');
const onDisconnectRedirectLink = Linking.createURL('onDisconnect');

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [nftMetada, setNFTMetadata] = useState<IDrop>({} as IDrop);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { get } = useApi();
  const [leaderBoard, setLeaderBoard] = useState(false);

  // Calculate the scaling factor

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    function handleResize() { }

    // window.addEventListener('resize', handleResize);

    return () => {
      // window.removeEventListener('resize', handleResize);
    };
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     // let { status } = await Location.requestForegroundPermissionsAsync();
  //     const { status } = await Location.getForegroundPermissionsAsync()

  //     if (status !== 'granted') {
  //       router.replace('/location');
  //       return;

  //       let { coords } = await Location.getCurrentPositionAsync();
  //       dispatch(
  //         updateCoordinate({
  //           lat: coords.latitude,
  //           lng: coords.longitude,
  //         })
  //       );
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== 'granted') {
        router.replace('/location');
        return;
      } else {
        const storedData = await AsyncStorage.getItem('user');
        const storedUser = storedData ? JSON.parse(storedData) : null;
        console.log(storedUser.id);

        if (storedUser?.id) {
          if (
            storedUser.lastFetch == -1 ||
            now() - storedUser.lastFetch > 60 * 10
          ) {
            const { data, error }: any = await supabase
            .from('user')
            .select('*')
            .eq('id', Number(storedUser?.id));

            console.log('userData', data);
            if (data) {
              dispatch(updateUser(data[0]));
            }
          } else {
            dispatch(updateUser(storedUser));
          }
        } else {
          router.replace('/sign-in');
        }
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      dispatch(
        updateCoordinate({
          lat: coords.latitude,
          lng: coords.longitude,
        })
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const countryInfo: any = await get(
        `https://nominatim.openstreetmap.org/reverse.php?lat=${user.lat}&lon=${user.lng}&zoom=5&format=jsonv2&accept-language=en`
      );
      dispatch(
        updateInit({
          country: countryInfo?.address?.country,
          city: countryInfo?.address?.city,
        })
      );
    })();
  }, [user.id, user.lng, user.lat]);

  const signIn = async (type: string) => {
    let userInfo: any;
    switch (type) {
      case 'google':
        userInfo = await googleSingin();
        break;
      case 'apple':
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          console.log(credential);
          userInfo = {
            name: credential.fullName?.familyName,
            email:
              credential.email ||
              `${credential.fullName?.familyName || 'new user'}@local.dev`,
          };
          // signed in
        } catch (e: any) {
          if (e.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
            Alert.alert('Canceled');
          } else {
            // handle other errors
            Alert.alert(e);
          }
        }
        break;
    }
    const { isUserIsExist, data } = await isUserIsExisted({
      email: userInfo.email,
    });

    if (isUserIsExist) {
      if (data.isRemoved) {
        return Alert.alert(
          'Your account is removed!',
          'Please contact with Trekn to re-active'
        );
      } else {
        dispatch(updateUser(data));
      }
    } else {
      await insertUser({
        props: userInfo,
        onSuccess: (data: any) => {
          dispatch(updateUser(data));
        },
      });
    }
    if (userInfo) {
      router.replace('/');
    }
  };

  // Connect Phantom
  const [deepLink, setDeepLink] = useState<string>('');

  const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
    useState<PublicKey | null>(null);

  const [dappKeyPair] = useState(nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState<Uint8Array>();
  // const [session, setSession] = useState<string>();

  // On app start up, listen for a "url" event
  useEffect(() => {
    const initializeDeeplinks = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
      }
    };
    initializeDeeplinks();
    const listener = Linking.addEventListener('url', handleDeepLink);
    return () => {
      listener.remove();
    };
  }, []);

  // When a "url" event occurs, track the url
  const handleDeepLink = ({ url }: Linking.EventType) => {
    setDeepLink(url);
  };

  useEffect(() => {
    if (!deepLink) return;

    const url = new URL(deepLink);
    const params = url.searchParams;

    // Handle an error response from Phantom
    if (params.get('errorCode')) {
      const error = Object.fromEntries([...params]);
      const message =
        error?.errorMessage ??
        JSON.stringify(Object.fromEntries([...params]), null, 2);
      console.log('error: ', message);
      return;
    }
    // Handle a `connect` response from Phantom
    if (deepLink.includes('account')) {
      const sharedSecretDapp = nacl.box.before(
        bs58.decode(params.get('phantom_encryption_public_key')!),
        dappKeyPair.secretKey
      );
      const connectData = decryptPayload(
        params.get('data')!,
        params.get('nonce')!,
        sharedSecretDapp
      );
      setSharedSecret(sharedSecretDapp);
      setSession(connectData.session);
      setPhantomWalletPublicKey(new PublicKey(connectData.public_key));
      console.log(`connected to ${connectData.public_key.toString()}`);

      linkWallet({
        userId: user.id,
        address: connectData.public_key.toString(),
      });
      dispatch(
        updateUser({ ...user, address: connectData.public_key.toString() })
      );
    }

    if (/onDisconnect/.test(url.pathname)) {
      setPhantomWalletPublicKey(null);
      console.log('disconnected');
    }
  }, [deepLink]);

  // Initiate a new connection to Phantom
  const connect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: 'mainnet-beta',
      app_url: 'https://app.trekn.xyz/',
      redirect_link: onConnectRedirectLink,
    });

    const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;
    Linking.openURL(url);
  };

  // Initiate a disconnect from Phantom
  const disconnect = async () => {
    const payload = {
      session,
    };
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    const url = buildUrl('disconnect', params);
    Linking.openURL(url);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => {
          dispatch(clearAccountData());
          dispatch(resetUser());
          router.replace('/sign-in');
        },
        session,
        isLoading,
        metadata: nftMetada,
        setMetadata: setNFTMetadata,
        windowSize: windowSize,
        leaderBoard: leaderBoard,
        setLeaderBoard: setLeaderBoard,
        connectWallet: connect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  metadata: IDrop;
  setMetadata: (metadata: any) => void;
  windowSize: {
    width: number;
    height: number;
  };
  leaderBoard: boolean;
  setLeaderBoard: (leaderBoard: boolean) => void;
  signIn: (type: string) => Promise<any>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
}

interface ICoords {
  log: number;
  lat: number;
}
