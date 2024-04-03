import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthContext } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLastFetch,
  updateNearBy,
  updateReadyToCollect,
} from '../redux/slides/locationSlides';
import { updateInit } from '../redux/slides/userSlides';
import useApi from '../hooks/useAPI';
import {
  getDropByUserAddress,
  getDropType,
  getNearByDrop,
} from '../middleware/data/drop';
import { getFollowerById, getFollowingById } from '../middleware/data/user';
import { getMintedByUserAddress } from '../middleware/data/minted';
import { sortDataByTimeline } from '../utils/account.util';
import { setDropType } from '../redux/slides/configSlice';
import request from '../axios';
import Header from '../components/home/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Discovery from '@/components/home/Discovery';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import ListHome from '@/components/home/ListHome';
import Addfriend from './addfriend';
import AddFriendList from '@/components/friend/AddFriendList';

export default function Page() {
  const { signOut } = useAuthContext();
  const { get } = useApi();
  // const filterScrollRef = useRef();
  const [readyToCollect, setReadyToCollect] = useState([]);
  const user = useSelector((state: any) => state.user);
  const location = useSelector((state: any) => state.location);
  const typeList = useSelector((state: any) => state.config?.dropType);
  const dispatch = useDispatch();
  const [nearBy, setNearBy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [follow, setFollowData] = useState({});
  const [currentView, setCurrentView] = useState('exploring');
  const [filter, setFilter] = useState('all');
  const [viewList, setViewList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isListView, setIsListView] = useState(false);

  const animatedRef: any = useAnimatedRef();
  const scroll = useSharedValue(0);
  const ITEM_SIZE = Dimensions.get('screen').height - 215;

  useDerivedValue(() => {
    scrollTo(animatedRef, 500, scroll.value + ITEM_SIZE, true);
  });

  useEffect(() => {
    (async () => {
      getDropType({ onSuccess: (data) => dispatch(setDropType(data)) });
    })();
  }, []);

  useEffect(() => {
    if (filter !== 'all') {
      const result = [...readyToCollect, ...nearBy].filter(
        (item: any) => item.type === filter
      );
      setViewList(result);
    } else {
      setViewList([...readyToCollect, ...nearBy]);
    }
  }, [readyToCollect, nearBy, filter]);

  const getNearBy = async (lat: any, lng: any) => {
    const data = await getNearByDrop({ lat, lng });
    dispatch(updateNearBy({ nearBy: data }));
    dispatch(setLastFetch());
    setNearBy(data);
    setLoading(false);
    setRefreshing(false);
  };

  const getReadyToCollect = async (lat: any, log: any) => {
    const res = await request.post('drop/getReadyToCollect', {
      lat: lat,
      lng: log,
    });

    dispatch(updateReadyToCollect({ readyToCollect: res.data.data }));
    dispatch(setLastFetch());
    setReadyToCollect(res.data.data);
  };

  useEffect(() => {
    if (user.lat) {
      setLoading(true);
      if (
        location.readyToCollect.length === 0 ||
        location.lastFetch === -1 ||
        (new Date().getTime() - location.lastFetch) / 1000 > 300
      ) {
        getReadyToCollect(user.lat, user.lng);
      } else {
        setReadyToCollect(location.readyToCollect);
      }
      getNearBy(user.lat, user.lng);
    }
  }, [user.lat, user.lng]);

  useEffect(() => {
    if (user.id) {
      (async () => {
        await getFollowingById({
          userId: user.id,
          onSuccess: (followingList) => {
            dispatch(updateInit({ following: followingList }));
          },
        });
        await getFollowerById({
          userId: user.id,
          onSuccess: (followerList) => {
            dispatch(updateInit({ follower: followerList }));
          },
        });
      })();
    }
  }, [user.id]);

  useEffect(() => {
    if (user.following && user.following.length > 0) {
      (async () => {
        const userData: any = [];
        await getDropByUserAddress({
          userId: user.following,
          onSuccess: (res) => {
            userData.push(
              ...res.map((item: any) => {
                item.type = 'drop';
                return item;
              })
            );
          },
        });

        await getMintedByUserAddress({
          userId: user.following,
          onSuccess: (res) => {
            userData.push(
              ...res.map((item: any) => {
                item.type = 'minted';
                return item;
              })
            );
          },
        });
        setFollowData(sortDataByTimeline(userData));
      })();
    }
  }, [user.following]);
  const handleScroll = (event: any) => {
    const windowHeight = event.nativeEvent.layoutMeasurement.height;
    const documentHeight = event.nativeEvent.contentSize.height;
    const scrollTop = event.nativeEvent.contentOffset.y;
    if (windowHeight + scrollTop >= documentHeight - 10) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
    if (scrollTop > 147 && !showAdd) {
      return setShowAdd(true);
    }
    if (scrollTop < 147) {
      return setShowAdd(false);
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getReadyToCollect(user.lat, user.lng);
    getNearBy(user.lat, user.lng);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Header></Header>
          <Animated.ScrollView
            ref={animatedRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Discovery
              viewList={readyToCollect}
              handleScrollDown={() => {
                if (!user.friends) {
                  router.push('/addfriend');
                } else {
                  scroll.value = scroll.value + 1;
                  setIsListView(true);
                }
              }}
            />
            {/* TODO: animation like locket */}
            {/* <ScrollView
            style={{
              height: Dimensions.get('screen').height
            }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            > */}
            <ListHome status={'Nearby'} data={nearBy} isEnd={isEnd} />
            {/* </ScrollView> */}
          </Animated.ScrollView>
        </>
      )}
      {/* <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: '15%',
          right: 2,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(148, 255, 65, 0.80)',
          opacity: nearBy.length !== 0 && !loading && showAdd ? 1 : 0,
        }}
        onPress={() => {
          if (user.lat && user.lng) {
            router.replace('/drop/add-post');
          } else {
            Alert.alert(
              'To drop and checkin you should enable your location to continue!',
              '',
              [
                {
                  text: 'Enable Location',
                  onPress: async () => {
                    Linking.openSettings();
                  },
                  style: 'default',
                },
                {
                  text: 'Cancel',
                },
              ],
              { cancelable: false }
            );
          }
        }}
      >
        <Image
          source={require('../assets/icon/union.png')}
          style={{
            width: 21,
            height: 32,
          }}
        />
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}
