import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { checkTimeAgo, getLabelLocation } from '../utils/common.utils';
import { useAuthContext } from '../context/AuthContext';
import moment from 'moment';
import {
  calculateDistance,
  convertDistance,
} from '../functions/calculateDistance';
import { getUserByDropId } from '../middleware/data/user';
import { getScore } from '../utils/account.util';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, usePathname } from 'expo-router';
import {
  faMapPin,
  faPlusCircle,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { G, Mask, Path, Rect, Svg } from 'react-native-svg';
import CustomCarousel from './carousel/Carousel';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

interface ImageProps {
  src: string;
  alt?: string;
}
export default function DetailCard({
  data,
  status,
  last,
}: {
  data: any;
  status?: any;
  last?: boolean;
}) {
  const { Icon, label } = getLabelLocation(status, data?.distance);
  const { windowSize } = useAuthContext();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [userChecked, setUserChecked] = useState([]);
  const [lastChecked, setLastChecked] = useState<any>(null);
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [muted, setMuted] = useState(true);
  const user = useSelector((state: any) => state.user);
  // const videoRef: any = useRef();
  const pathname = usePathname();

  const overlap = 13.75;

  const isHome = () => {
    return pathname === '/';
  };

  useEffect(() => {
    // get to check user checked
    getUserByDropId({
      dropId: data.drop_id || data.id,
      onSuccess: (res) => {
        setUserChecked(res);

        if (res) {
          for (let userChecked of res) {
            if (userChecked.minted.length > 0) {
              const have_last_checked =
                moment().unix() -
                  moment(userChecked.minted[0].created_at).unix() <=
                60 * 60 * 24 * 2;

              if (have_last_checked) {
                setLastChecked(userChecked);
              }
            }
          }
        }
      },
    });
  }, []);

  const getWidth = () => {
    if (userChecked.length > 1) {
      return 22.4 * userChecked.length;
    }
    return 28;
  };

  // useAutoPlay(videoRef);
  return (
    <View style={{ marginTop: 24 }}>
      {isHome() && lastChecked && (
        <View style={{ marginBottom: 3 }}>
          <Text style={{ fontSize: 13, color: 'black', opacity: 0.7 }}>
            <FontAwesomeIcon
              size={13}
              icon={faMapPin}
              style={{ marginRight: 4 }}
            />{' '}
            {lastChecked.name} checkin{' '}
            {moment(lastChecked.minted[0].created_at).startOf('hour').fromNow()}
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
          marginLeft: 8,
        }}
        key={data.id}
      >
        <Pressable
          onPress={() =>
            data?.user.id !== user.id &&
            router.replace(`/account/${data.user.id}`)
          }
        >
          {data.user.profile_image || data.user.profileImage ? (
            <Image
              source={{
                uri: data.user.profileImage || data.user.profile_image,
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 20,
                marginRight: 8,
              }}
            />
          ) : (
            <Svg
              viewBox='0 0 36 36'
              fill='none'
              role='img'
              width='40'
              height='40'
              style={{
                width: 32,
                height: 32,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Mask
                id=':r6:'
                maskUnits='userSpaceOnUse'
                x='0'
                y='0'
                width='36'
                height='36'
              >
                <Rect width='36' height='36' rx='72' fill='#FFFFFF'></Rect>
              </Mask>
              <G mask='url(#:r6:)'>
                <Rect width='36' height='36' fill='#ff7d10' />
                <Rect
                  x='0'
                  y='0'
                  width='36'
                  height='36'
                  transform='translate(4 4) rotate(340 18 18) scale(1.1)'
                  fill='#0a0310'
                  rx='36'
                />
                <G transform='translate(-4 -1) rotate(0 18 18)'>
                  <Path
                    d='M15 20c2 1 4 1 6 0'
                    stroke='#FFFFFF'
                    fill='none'
                    stroke-linecap='round'
                  ></Path>
                  <Rect
                    x='14'
                    y='14'
                    width='1.5'
                    height='2'
                    rx='1'
                    stroke='none'
                    fill='#FFFFFF'
                  ></Rect>
                  <Rect
                    x='20'
                    y='14'
                    width='1.5'
                    height='2'
                    rx='1'
                    stroke='none'
                    fill='#FFFFFF'
                  ></Rect>
                </G>
              </G>
            </Svg>
          )}
        </Pressable>

        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontWeight: '500',
              // marginBottom: 8,
              fontSize: 15,
              lineHeight: 16,
            }}
          >
            {data.user.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* {isHome() ? (
              <FontAwesomeIcon size={12} icon={faPlusCircle} />
            ) : data?.type === 'minted' ? (
              <FontAwesomeIcon size={13} icon={faMapPin} />
            ) : (
              <FontAwesomeIcon size={13} icon={faPlusCircle} />
            )} */}
            <Text
              style={{
                fontWeight: '500',
                color: 'black',
                opacity: 0.5,
                marginLeft: 4,
                fontSize: 13,
                lineHeight: 16,
              }}
            >
              {checkTimeAgo(data.created_at)}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 3,
          overflow: 'hidden',
        }}
        // onMagicTap={() => {
        // if (videoRef.current && muted) {
        //   setMuted(false);
        // } else {
        // router.replace(`/detail/${data.id}`);
        // }
        // }}
      >
        <View
          style={{
            position: 'relative',
            height: Dimensions.get('window').width,
            width: '100%',
          }}
        >
          {(data?.drop?.imageArray || data?.imageArray) &&
          (data?.drop?.imageArray.length > 1 || data?.imageArray.length > 1) ? (
            <CustomCarousel data={data} setCurrentImg={setCurrentImg} fullWidth />
          ) : (
            <Image
              source={data?.image || data?.drop?.image}
              alt='Drop Img'
              style={{
                height: '100%',
                width: '100%',
              }}
              contentFit='cover'
            />
          )}
          <Pressable
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 16,
              paddingTop: 12,
              zIndex: 10,
            }}
            // onPress={() => {
            //   router.replace(`/detail/${data.id}`);
            // }}
          >
            <BlurView
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                top: 0,
                left: 0,
                overflow: 'hidden',
              }}
              tint='dark'
            >
              <Image
                source={
                  data?.drop?.imageArray || data?.imageArray
                    ? (data.imageArray
                        ? data.imageArray
                        : data?.drop?.imageArray)[currentImg]
                    : data?.image || data?.drop?.image
                }
                style={{
                  height: '100%',
                  width: '100%',
                }}
                contentPosition={'bottom'}
                blurRadius={100}
              />
            </BlurView>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 16,
                lineHeight: 24,
                color: 'white',
                marginBottom: 8,
              }}
            >
              {data?.name || data?.drop?.name}
            </Text>
            <View style={{ flexDirection: 'row', columnGap: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 4,
                }}
              >
                <FontAwesomeIcon color='#FFB800' size={16} icon={faThumbsUp} />
                <Text
                  style={{
                    color: 'white',
                    opacity: 0.7,
                    fontSize: 14,
                    fontWeight: '500',
                    lineHeight: 20,
                  }}
                >
                  {getScore(data, false)}
                </Text>
              </View>
              <Text
                style={{
                  color: 'white',
                  opacity: 0.7,
                  fontSize: 14,
                  lineHeight: 20,
                  fontWeight: '500',
                }}
              >
                <Text
                  style={{ color: 'white', lineHeight: 20, fontWeight: '500' }}
                >
                  ●
                </Text>{' '}
                {convertDistance(
                  calculateDistance(
                    data.lat || data?.drop.lat,
                    data.lng || data?.drop.lng,
                    data.user.lat || user.lat,
                    data.user.lng || user.lng
                  )
                )}{' '}
                away
              </Text>
            </View>

            {userChecked.length > 0 && (
              <View
                style={{
                  marginTop: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  columnGap: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width:
                      userChecked.length === 1 ? 30 : userChecked.length * 22.5,
                  }}
                >
                  {userChecked.map((item: any, idx: number) => (
                    <Image
                      key={idx}
                      source={{ uri: item.profileImage }}
                      alt={item.profileImage}
                      style={{
                        borderWidth: 1.146,
                        borderColor: 'white',
                        width: 30,
                        height: 30,
                        borderRadius: 50,
                        left: idx * overlap,
                        zIndex: idx + 1,
                        backgroundColor: 'white',
                        position: 'absolute',
                      }}
                    />
                  ))}
                </View>
                <View
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    borderRadius: 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      color: 'black',
                      lineHeight: 13,
                    }}
                  >
                    {userChecked.length} check-ins
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* {!last && (
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: '#EAEAEA',
            marginTop: 24,
          }}
        />
      )} */}
      {last && <View style={{ marginTop: 20 }} />}
    </View>
  );
}
