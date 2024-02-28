import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPen } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';
import CustomSelect from '../../components/crud/CustomSelect';
import { createDrop } from '../../middleware/data/drop';
import { supabase } from '../../utils/supabaseClients';
import { uploadImage } from '../../functions/uploadImage';
import OutsidePressHandler from 'react-native-outside-press';

export default function EnterDropInfo() {
  const windowWidth = Dimensions.get('screen').width;
  const windowHeight = Dimensions.get('screen').height;
  console.log(windowWidth, windowHeight);

  const { metadata, setMetadata, scalingFactor } = useAuthContext();
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
          height: Dimensions.get('screen').height - 40
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
        paddingHorizontal: 20,
        paddingVertical: 30,
        width: '100%',
        backgroundColor: '#000000',
        flexDirection: 'column',
        position: 'relative',
        height: Dimensions.get('screen').height - 40
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute' }}
          onPress={() => {
            setMetadata({});
            router.replace('/');
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={16}
            color='#FFFFFFB2'
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <View
          style={{
            position: 'relative',
            width: 120,
            height: 120,
            borderRadius: 13.267,
            overflow: 'hidden',
          }}
        >
          {metadata.image || metadata.imageArray ? (
            <Image
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              source={{
                uri: metadata.image.uri,
              }}
            />
          ) : (
            <Image
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              source={{
                uri: 'https://s3-alpha-sig.figma.com/img/1c26/274c/b69105586c17c648ee712f87c289ee16?Expires=1707091200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HOWSqJ1fa-pXRu7a3GgAyUd2FzWeAb2ic89FAwUg~6GGdYIakfudX4FIu8hc1JE1bZng5kidOFFf~7COTdh5Cd7HTQoUNwuHhRLs33MkMXRm3C-wgfRsQNHNCUGEyBYpmykzvyxCdZmqoWYNWy55nwn-qUoNlwy2G9lgH6S4Qra-T~3uh3uKi5waE2fPbKmcIM60-UZ~4d-H79~0NxpxN~itrJ4Dfl2ZetgHJBlnL~wB3cIFHcNpquh2~wWbN-zVEezsmfYpaIWswwC~w76bnWCmqtnX5syEQL7AVzdGenTbZBIx9X7nV91~YnPAcdl976~34S-IInKCN23~pgQV6g__',
              }}
            />
          )}

          {metadata.imageArray?.length > 1 && (
            <View
              style={{
                position: 'absolute',
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.70)',
                bottom: 8,
                right: 8,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
              >
                {metadata.imageArray.length}
              </Text>
            </View>
          )}
        </View>

        <View style={{ justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 999,
              height: 32,
              width: 124,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          // onPress={() => navigation.navigate('CheckInUploadImage')}
          >
            <Text
              style={{
                color: 'black',
                fontWeight: '500',
                fontSize: 16,
              }}
            >
              Edit media
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, flexDirection: 'column', gap: 20 }}>
        <View>
          <Text
            style={{
              fontSize: 13,
              color: '#BDBDBA',
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            Location name
          </Text>

          <View
            style={{ borderRadius: 12, overflow: 'hidden' }}
          >
            <OutsidePressHandler
              onOutsidePress={() => {
                Keyboard.dismiss()
              }}
            >
              <TextInput
                defaultValue={name}
                placeholder='All day coffee...'
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

        <View>
          <Text
            style={{
              fontSize: 13,
              color: '#BDBDBA',
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            Description
          </Text>
          <View
            style={{ borderRadius: 12, overflow: 'hidden' }}
          >
            <OutsidePressHandler
              onOutsidePress={() => {
                Keyboard.dismiss()
              }}
            >
              <TextInput
                value={description}
                placeholder='Write something about this place...'
                onChangeText={(value) => setDescription(value)}
                placeholderTextColor={'rgba(255, 255, 255, 0.50)'}
                style={{
                  paddingTop: 16,
                  paddingHorizontal: 12,
                  width: '100%',
                  height: 120,
                  fontSize: 16,
                  backgroundColor: '#212121de',
                  color: 'white',
                  textAlignVertical: 'top'
                }}
                multiline
                numberOfLines={4}
              />
            </OutsidePressHandler>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 13,
              color: '#BDBDBA',
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            Type
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

        <View>
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
                Keyboard.dismiss()
              }}
            >
              <TextInput
                defaultValue={metadata.location}
                editable={false}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  paddingRight: 40,
                  width: '100%',
                  fontSize: 16,
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
            >
              <FontAwesomeIcon
                icon={faPen}
                size={16}
                color='white'
              // onPress={() => navigation.navigate('CheckInEditLocation')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Pressable
        style={{
          backgroundColor: '#2E2E2E',
          borderRadius: 24,
          paddingVertical: 12,
        }}
        onPress={async () => {
          setIsLoading(true);
          let imageArray: string[] = [];
          const promises: any = [];

          await metadata.imageArray.forEach(async (image: any) => {
            promises.push(uploadImage(image));
            imageArray.push(
              `https://${process.env.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.EXPO_PUBLIC_AWS_REGION}.amazonaws.com/data/${image.fileName}`
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
                onSuccess: () => { },
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
        <Text
          style={{
            color: '#FFF',
            textAlign: 'center',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: 24,
          }}
        >
          Confirm
        </Text>
      </Pressable>
    </View>
  );
}
