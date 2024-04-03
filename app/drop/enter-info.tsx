import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faCheckCircle,
  faPen,
  faPlus,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';
import CustomSelect from '../../components/crud/CustomSelect';
import { createDrop } from '../../middleware/data/drop';
import { uploadImage } from '../../functions/uploadImage';
import OutsidePressHandler from 'react-native-outside-press';
import { randomNumber } from '@/utils/drop.util';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

export default function EnterDropInfo() {
  const { metadata, setMetadata } = useAuthContext();
  const user = useSelector((state: any) => state.user);
  const typeList = useSelector((state: any) => state.config?.dropType);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(metadata?.name);
  const [type, setType] = useState(metadata?.type);
  const [description, setDescription] = useState(metadata?.description);

  const handleError = () => {
    // const modal = Modal.error({
    //   title: 'Error',
    //   content: 'Something is wrong',
    //   okButtonProps: {
    //     type: 'default',
    //     style: {
    //       background: 'red',
    //       color: 'white',
    //     },
    //   },
    // });

    setTimeout(() => {
      // setMetadata({});
      //   modal.destroy();
      //   navigate('/check-in/upload-image');
    }, 2000);
  };

  useEffect(() => {
    if (
      !metadata.image ||
      !metadata.imageArray ||
      !user.id ||
      !metadata.location ||
      !metadata.location_name ||
      !metadata.lat ||
      !metadata.lng
    ) {
      handleError();
    }
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          height: Dimensions.get('screen').height - 40,
        }}
      >
        <ActivityIndicator size={'large'} color={'#FFF'} />
        <Text
          style={{
            marginTop: 12,
            color: '#FFF',
            fontSize: 16,
          }}
        >
          Droping...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#000000',
        flexDirection: 'column',
        position: 'relative',
        paddingTop: Constants.statusBarHeight,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <TouchableOpacity
          style={{ marginRight: 0 }}
          onPress={() => {
            setMetadata({});
            router.replace('/');
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={16} color='#FFFFFFB2' />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            flex: 1,
          }}
        >
          Add a new spot
        </Text>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ScrollView
            horizontal
            style={{
              marginBottom: 65,
            }}
            contentOffset={{ x: 283 / 3, y: 0 }}
            showsHorizontalScrollIndicator={false}
          >
            {metadata.imageArray.map((image: any) => (
              <Image
                source={{
                  uri: image.uri,
                }}
                style={{
                  width: 283,
                  height: 283,
                  marginRight: 16,
                }}
              />
            ))}

            <View
              style={{
                marginLeft: 52,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Pressable
                style={{
                  width: 69,
                  height: 69,
                  borderWidth: 1,
                  borderColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 999,
                }}
                onPress={() => {
                  console.log('Add more image');
                }}
              >
                <FontAwesomeIcon icon={faPlus} size={40} color='white' />
              </Pressable>
            </View>
          </ScrollView>
        </View>

        <View style={{ flex: 1, flexDirection: 'column', gap: 20 }}>
          <View
            style={{
              paddingBottom: 24,
              borderBottomWidth: 1,
              borderColor: 'rgb(80, 80, 80)',
            }}
          >
            <View style={{ overflow: 'hidden' }}>
              <OutsidePressHandler
                onOutsidePress={() => {
                  Keyboard.dismiss();
                }}
              >
                <TextInput
                  value={description}
                  placeholder='Describe this spot...'
                  onChangeText={(value) => setDescription(value)}
                  placeholderTextColor={'rgb(189, 189, 186)'}
                  style={{
                    width: '100%',
                    fontSize: 16,
                    fontWeight: '500',
                    backgroundColor: 'black',
                    color: 'white',
                    textAlignVertical: 'top',
                  }}
                  multiline
                  numberOfLines={4}
                />
              </OutsidePressHandler>
            </View>
          </View>
          <View
            style={{
              paddingBottom: 24,
              borderBottomWidth: 1,
              borderColor: 'rgb(80, 80, 80)',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: '#BDBDBA',
                fontWeight: 'bold',
                marginBottom: 12,
              }}
            >
              Enter location name...
            </Text>

            <View style={{ borderRadius: 12, overflow: 'hidden' }}>
              <OutsidePressHandler
                onOutsidePress={() => {
                  Keyboard.dismiss();
                }}
              >
                <TextInput
                  defaultValue={name}
                  placeholder='Enter location name...'
                  placeholderTextColor={'rgba(255, 255, 255, 0.50)'}
                  onChangeText={(value) => {
                    setName(value);
                  }}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    width: '100%',
                    fontSize: 16,
                    height: 51,
                    backgroundColor: '#212121de',
                    color: 'white',
                  }}
                />
              </OutsidePressHandler>
            </View>
          </View>

          <View
            style={{
              paddingBottom: 24,
              borderBottomWidth: 1,
              borderColor: 'rgb(80, 80, 80)',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: '#BDBDBA',
                fontWeight: 'bold',
                marginBottom: 8,
              }}
            >
              Location address
            </Text>
            <View
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <OutsidePressHandler
                onOutsidePress={() => {
                  Keyboard.dismiss();
                }}
              >
                <TextInput
                  placeholder='Add location address'
                  placeholderTextColor={'rgba(255, 255, 255, 0.50)'}
                  defaultValue={metadata.location}
                  editable={false}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    paddingRight: 40,
                    width: '100%',
                    fontSize: 16,
                    fontWeight: '600',
                    height: 59,
                    backgroundColor: '#212121de',
                    color: 'white',
                  }}
                />
              </OutsidePressHandler>
              <TouchableOpacity
                style={{
                  borderRadius: 999,
                  backgroundColor: '#373737',
                  padding: 8,
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
                onPress={() => {
                  setMetadata({ ...metadata, name, description })
                  router.replace('/drop/edit-location')
                }
                }
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size={16}
                  color='white'
                // onPress={() => navigation.navigate('CheckInEditLocation')}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              paddingBottom: 43,
              borderBottomWidth: 1,
              borderColor: 'rgb(80, 80, 80)',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: '#BDBDBA',
                fontWeight: 'bold',
                marginBottom: 8,
              }}
            >
              Add location type
            </Text>
            <View style={{ marginTop: 1 }}>
              <CustomSelect
                placeholder='Select type of location'
                options={typeList}
                recommend
                onChange={(value: any) => {
                  setType(value);
                }}
              />
            </View>
          </View>
        </View>

        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2E2E2E',
            borderRadius: 24,
            paddingVertical: 12,
            marginVertical: 24,
          }}
          onPress={async () => {
            setIsLoading(true);
            let imageArray: string[] = [];
            const promises: any = [];

            await metadata.imageArray.forEach(async (image: any) => {
              const fileName = `${randomNumber().toString()}.jpg`;
              promises.push(
                uploadImage({
                  fileName: fileName,
                  ...image,
                })
              );
              imageArray.push(
                `https://${process.env.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.EXPO_PUBLIC_AWS_REGION}.amazonaws.com/data/${fileName}`
              );
            });

            Promise.all(promises)
              .then(async function (data) {
                console.log('Upload success');

                await createDrop({
                  drop: {
                    ...metadata,
                    name: name,
                    description: description,
                    type: type,
                    image: imageArray[0],
                    imageArray: imageArray,
                  },
                  user,
                  onSuccess: (data) => { setMetadata({...metadata, dropId: data?.id}) },
                  onError: (error) => {
                    console.log(error);
                  },
                });

                router.replace('/drop/success');

                setIsLoading(false);
              })
              .catch(function (err) {
                console.log('Error', err);
                setIsLoading(false);
              });
          }}
        >
          <FontAwesomeIcon icon={faCheckCircle} size={16} color='white' />
          <Text
            style={{
              color: '#FFF',
              textAlign: 'center',
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: 24,
              marginLeft: 8,
            }}
          >
            Confirm
          </Text>
        </Pressable>
      </ScrollView >
      <StatusBar style='light' />
    </View >
  );
}
