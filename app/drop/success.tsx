import React, { useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import PointPlusItem from '../../components/PointPlusItem';
import { useAuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';

const DropSuccess = () => {
  const { metadata, setMetadata, scalingFactor } = useAuthContext();

  const handleError = () => {
    // Modal.error({
    //   title: 'Error',
    //   content: 'Info of this drop is missing',
    //   okButtonProps: {
    //     type: 'default',
    //     style: {
    //       backgroundColor: 'red',
    //       color: 'white',
    //     },
    //   },
    //   onOk: () => {
    //     setMetadata({});
    //     navigation.navigate('CheckInUploadImage');
    //   },
    // });
  };

  useEffect(() => {
    if (
      !metadata.name ||
      !metadata.image ||
      !metadata.location ||
      !metadata.description
    ) {
      handleError();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ marginHorizontal: 20, marginTop: 58 * scalingFactor }}>
        <View style={{ marginBottom: 24 * scalingFactor }}>
          <PointPlusItem icon point='200' />
          <Text
            style={{
              color: '#FFF',
              fontSize: 24 * scalingFactor,
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 40,
              letterSpacing: -0.08,
              marginVertical: 12 * scalingFactor,
            }}
          >
            Added successful
          </Text>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.50)',
              fontFamily: 'Work Sans',
              fontSize: 16 * scalingFactor,
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: 24,
              letterSpacing: -0.08,
            }}
          >
            Now anyone can get here and check-in!
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 57 * scalingFactor,
          }}
        >
          {metadata.image?.type === 'video' ? (
            <></>
          ) : (
            // <Video
            //   source={{ uri: URL.createObjectURL(metadata.image) }}
            //   style={{
            //     width: 339,
            //     height: 339,
            //     borderRadius: 10,
            //     marginBottom: 3,
            //   }}
            //   resizeMode='cover'
            //   shouldPlay
            // />
            <Image
              source={{ uri: metadata.image.uri }}
              style={{
                width: '100%',
                height: 339 * scalingFactor,
                borderRadius: 10,
                marginBottom: 3,
              }}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <Pressable
            style={{
              backgroundColor: '#2E2E2E',
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: 24,
            }}
            onPress={() => {}}
          >
            <FontAwesomeIcon icon={faShare} color='#FFFFFFB2' size={24} />
          </Pressable>

          <Pressable
            style={{
              backgroundColor: '#2E2E2E',
              paddingVertical: 12,
              borderRadius: 24,
              flex: 2,
            }}
            onPress={() => {
              setMetadata({});
              router.replace('/');
            }}
          >
            <Text
              style={{
                color: '#FFF',
                textAlign: 'center',
                fontSize: 16 * scalingFactor,
                fontWeight: 'bold',
                lineHeight: 24,
              }}
            >
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default DropSuccess;
