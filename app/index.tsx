import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Text,
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
import { capitalizeFirstLetter } from '../functions/text';
import { getDropByUserAddress, getDropType } from '../middleware/data/drop';
import { getFollowerById, getFollowingById, getLeaderBoardPoint } from '../middleware/data/user';
import { getMintedByUserAddress } from '../middleware/data/minted';
import { sortDataByTimeline } from '../utils/account.util';
import Feed from '../components/Feed';
import { setDropType } from '../redux/slides/configSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import request from '../axios';
import { faMap, faPlus } from '@fortawesome/free-solid-svg-icons';
import ListDetail from '../components/ListDetail';
import Header from '../components/home/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import BeaconItem from '@/components/beacon/BeaconItem';

export default function Page() {
    const { leaderBoard } = useAuthContext();
    const { get } = useApi();
    // const filterScrollRef = useRef();
    const [readyToCollect, setReadyToCollect] = useState([]);
    const user = useSelector((state: any) => state.user);
    const location = useSelector((state: any) => state.location);
    const typeList = useSelector((state: any) => state.config?.dropType);
    const dispatch = useDispatch();
    const [nearBy, setNearBy] = useState([]);
    const [loading, setLoading] = useState(false);
    const [leaderBoardPoint, setLeaderBoardPoint] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(true);
    const [follow, setFollowData] = useState({});
    const [currentView, setCurrentView] = useState('exploring');
    const [filter, setFilter] = useState('all');
    const [viewList, setViewList] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        (async () => {
            getDropType({ onSuccess: (data) => dispatch(setDropType(data)) });
            getLeaderBoardPoint({
                onSuccess: (data) => {
                    setLeaderBoardPoint(data);
                },
            });
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
    const getNearBy = async (lat: any, log: any) => {
        setLoading(true);
        const res = await request.post('drop/getNearBy', {
            lat: lat,
            lng: log,
        });
        dispatch(updateNearBy({ nearBy: res.data.data }));
        dispatch(setLastFetch());
        setNearBy(res.data.data);
        setLoading(false);
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
            if (
                location.readyToCollect.length === 0 ||
                location.lastFetch === -1 ||
                (location.lastFetch - new Date().getTime()) / 1000 > 300
            ) {
                getReadyToCollect(user.lat, user.lng);
            } else {
                setReadyToCollect(location.readyToCollect);
            }

            if (
                location.nearBy.length === 0 ||
                location.lastFetch === -1 ||
                (location.lastFetch - new Date().getTime()) / 1000 > 300
            ) {
                getNearBy(user.lat, user.lng);
            } else {
                setNearBy(location.nearBy);
            }
        }
    }, [user.lat]);

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
        if (!user.country || !user.city) {
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
        }
    }, [user.id, user.lng, user.lat]);

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <ScrollView
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
                    style={{ flex: 1 }}
                >
                    <Header />
                    <View style={{ marginTop: 24, height: 36 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 5 }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    borderWidth: 1,
                                    borderColor: 'black',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12
                                }}
                                onPress={() => {
                                    router.replace('/map-view');
                                }}
                            >
                                <FontAwesomeIcon icon={faMap} size={16} color='black' />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: filter === 'all' ? '#99FF48' : '#F2F2F2',
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    borderRadius: 18,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12
                                }}
                                onPress={() => setFilter('all')}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: filter === 'all' ? '#020303' : '#707070',
                                        fontWeight: 'bold',
                                        lineHeight: 18,
                                        letterSpacing: -0.08,
                                    }}
                                    numberOfLines={1}
                                >
                                    All in {user.city}
                                </Text>
                            </TouchableOpacity>
                            {typeList?.map((item: any, idx: number) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={{
                                        backgroundColor: filter === item.id ? '#99FF48' : '#F2F2F2',
                                        paddingHorizontal: 10,
                                        paddingVertical: 6,
                                        borderRadius: 18,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12
                                    }}
                                    onPress={() => setFilter(item.id)}
                                >
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: filter === item.id ? '#020303' : '#707070',
                                            fontWeight: 'bold',
                                            lineHeight: 18,
                                            letterSpacing: -0.08,
                                        }}
                                        numberOfLines={1}
                                    >
                                        {capitalizeFirstLetter(item.type)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={{ paddingHorizontal: 20, flex: 1, position: 'relative' }}>
                        {currentView === 'exploring' && (
                            <Fragment>
                                <View style={{ marginTop: 24 }}>
                                    {viewList.length !== 0 ? (
                                        <Fragment>
                                            <BeaconItem />
                                            {/* <Text
                                                style={{
                                                    fontSize: 28,
                                                    fontWeight: 'bold',
                                                    marginBottom: 24,
                                                }}
                                            >
                                                Nearby experiences
                                            </Text> */}
                                            <ListDetail status={'Nearby'} data={viewList} isEnd={isEnd} />
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <View
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    paddingHorizontal: 5,
                                                    height: Dimensions.get('screen').height - 350,
                                                }}
                                            >
                                                <Image
                                                    style={{ width: 223, height: 223 }}
                                                    source={require('../assets/old-image/Route_search.png')}
                                                />
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        lineHeight: 18,
                                                        fontWeight: 'bold',
                                                        color: 'black',
                                                        opacity: 0.5,
                                                        textAlign: 'center',
                                                        paddingHorizontal: 5,
                                                        marginTop: 10,
                                                    }}
                                                >
                                                    No discoveries shared yet, you're the pioneer here—share your first discovery and start shaping the map!
                                                </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        borderRadius: 20,
                                                        backgroundColor: 'black',
                                                        width: '100%',
                                                        marginTop: 10,
                                                        paddingVertical: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                    }}
                                                    onPress={() => {
                                                        router.replace('/drop/upload-image');
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} size={24} color='white' />
                                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>
                                                        Drop a new experience
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Fragment>
                                    )}
                                </View>
                            </Fragment>
                        )}
                        {currentView === 'following' && (
                            <Fragment>
                                <View style={{ marginTop: 9 }}>
                                    {Object.entries(follow).length > 0 && Object.entries(follow).map(([key, data]: any, dataIdx) => (
                                        <Fragment key={dataIdx}>
                                            {data.map((item: any, itemIdx: number) => (
                                                <Fragment key={itemIdx}>
                                                    <Feed wrapperData={follow} data={data} dataIdx={dataIdx} item={item} itemIdx={itemIdx} />
                                                </Fragment>
                                            ))}
                                        </Fragment>
                                    ))}
                                    {!loading && Object.entries(follow).length === 0 && (
                                        <View style={{ position: 'absolute', top: 106, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: -1, paddingHorizontal: '11.736%' }}>
                                            <Image
                                                source={require('../assets/old-image/bubble-with-a-cross.svg')}
                                                style={{ width: 152, height: 158 }}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: '500',
                                                    lineHeight: 18.2,
                                                    color: '#707070CC',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                Your Following list is empty. Start connecting! Follow people or add friends to see their updates here.
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Fragment>
                        )}
                    </View>
                </ScrollView>
            )}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 80,
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
                    router.replace('/check-in/nearby');
                }}
            >
                <FontAwesomeIcon icon={faPlus} size={24} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
