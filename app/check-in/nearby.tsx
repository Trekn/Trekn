import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import PointPlusItem from '../../components/PointPlusItem';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export default function NearBy() {
  const [locationList, setLocationList] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const readyToCollectData = useSelector(
    //TODO: change to readyToCollect
    (state: any) => state?.location?.readyToCollect
  );
  const user = useSelector((state: any) => state?.user);

  useEffect(() => {
    const data = readyToCollectData.filter(
      (item: any) => item?.author_id !== user.id
    );
    setLocationList(data);
  }, []);

  const handleFilterLocation = (value: any) => {
    setLocationFilter(value);
    const result = value
      ? readyToCollectData.filter((location: any) =>
          location.name.toLowerCase().includes(value)
        )
      : readyToCollectData;
    setLocationList(result);
  };

  const NoLocationList = () => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center', width: 234, marginTop: '55%' }}>
        <View style={{ marginBottom: 16, paddingHorizontal: 37.5 }}>
          <Image
            source={require('@/assets/images/spyglass.png')}
            alt='spyglass'
            style={{
              width: 158,
              height: 158,
            }}
          />
        </View>
        <Text
          style={{
            color: '#BDBDBD',
            textAlign: 'center',
            fontSize: 13,
            fontStyle: 'italic',
            fontWeight: '500',
            height: 72,
          }}
        >
          Your current location has no place to check-in. If you’ve discovered a
          new place, please help other to uncover it by adding a new place :)
        </Text>
        <View
          style={{
            backgroundColor: '#2E2E2E',
            borderRadius: 999,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginTop: 16,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '500',
              color: '#BDBDBD',
            }}
          >
            To earn +200 points
          </Text>
        </View>
      </View>
      <Pressable
        style={{
          backgroundColor: '#2E2E2E',
          padding: 15,
          borderRadius: 24,
          borderWidth: 0,
          width: '100%',
          bottom: '1%',
          position: 'absolute',
        }}
        // onPress={() => router.replace('/drop/upload-image')}
        onPress={() => router.replace('/drop/add-post')}
      >
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Create a new place
        </Text>
      </Pressable>
    </View>
  );

  const RenderLocationList = ({
    locationList,
    locationFilter,
    handleFilterLocation,
  }: any) => (
    <ScrollView style={{ paddingHorizontal: 2, marginTop: 8 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '500',
          color: '#FFFFFF70',
          marginBottom: 6,
        }}
      >
        {locationList.length} places
      </Text>
      {locationList.map((location: any, idx: number) => (
        <View key={idx} style={{ marginBottom: 5 }}>
          <Pressable
            onPress={() => {
              router.replace(`/check-in/add-image/${location.id}`);
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 2,
              }}
            >
              {location.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{ fontSize: 13, color: '#FFFFFF70', overflow: 'hidden' }}
            >
              {location.location_name}
            </Text>
            <View
              style={{
                height: 1,
                marginVertical: 4,
                backgroundColor: '#626262',
              }}
            />
          </Pressable>
          {idx + 1 === locationList.length && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Pressable
                onPress={() => router.replace('/drop/upload-image')}
                style={{
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color: '#99FF48',
                    fontSize: 13,
                    lineHeight: 13,
                    marginTop: 8,
                  }}
                >
                  Add a new place
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 20,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#000000',
        minHeight: Dimensions.get('screen').height - 40,
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
      >
        <Pressable onPress={() => router.replace('/')}>
          <FontAwesomeIcon icon={faArrowLeft} size={16} color='#FFFFFFB2' />
        </Pressable>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Select a spot to checkin
        </Text>
      </View>

      {!locationList.length && locationFilter && (
        <View style={{ marginBottom: 6 }}>
          <TextInput
            style={{
              backgroundColor: '#2C2C2C',
              color: 'white',
              padding: 10,
              borderRadius: 5,
            }}
            value={locationFilter}
            onChangeText={handleFilterLocation}
            placeholder='Where are you?'
            placeholderTextColor='#ffffff70'
          />
        </View>
      )}

      {!locationList.length ? (
        <NoLocationList />
      ) : (
        <RenderLocationList
          locationList={locationList}
          locationFilter={locationFilter}
          handleFilterLocation={handleFilterLocation}
        />
      )}
      <StatusBar style='light' />
    </View>
  );
}
