import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, SafeAreaView, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import PointPlusItem from '../../components/PointPlusItem';
import { useAuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';

const DropSuccess = () => {
  const { metadata, setMetadata } = useAuthContext();

  const widthScreen = Dimensions.get('screen').width;
  const width = widthScreen - 40 - 32;

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
    // <SafeAreaView style={{ flex: 1, backgroundColor: 'black', height: Dimensions.get('screen').height - (StatusBar.currentHeight || 40) }}>
    //   <View style={{ marginHorizontal: 20, marginTop: 58 }}>
    //     <View style={{ marginBottom: 24 }}>
    //       <PointPlusItem icon point='200' />
    //       <Text
    //         style={{
    //           color: '#FFF',
    //           fontSize: 24,
    //           fontStyle: 'normal',
    //           fontWeight: '700',
    //           lineHeight: 40,
    //           letterSpacing: -0.08,
    //           marginVertical: 12,
    //         }}
    //       >
    //         Added successful
    //       </Text>
    //       <Text
    //         style={{
    //           color: 'rgba(255, 255, 255, 0.50)',
    //           fontSize: 16,
    //           fontStyle: 'normal',
    //           fontWeight: '500',
    //           lineHeight: 24,
    //           letterSpacing: -0.08,
    //         }}
    //       >
    //         Now anyone can get here and check-in!
    //       </Text>
    //     </View>

    //     <View
    //       style={{
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         marginBottom: 57,
    //       }}
    //     >
    //       {metadata.image?.type === 'video' ? (
    //         <></>
    //       ) : (
    //         // <Video
    //         //   source={{ uri: URL.createObjectURL(metadata.image) }}
    //         //   style={{
    //         //     width: 339,
    //         //     height: 339,
    //         //     borderRadius: 10,
    //         //     marginBottom: 3,
    //         //   }}
    //         //   resizeMode='cover'
    //         //   shouldPlay
    //         // />
    //         <Image
    //           source={{ uri: metadata.image.uri }}
    //           style={{
    //             width: '100%',
    //             height: 339,
    //             borderRadius: 10,
    //             marginBottom: 3,
    //           }}
    //         />
    //       )}
    //     </View>

    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         gap: 12,
    //       }}
    //     >
    //       <Pressable
    //         style={{
    //           backgroundColor: '#2E2E2E',
    //           paddingHorizontal: 32,
    //           paddingVertical: 12,
    //           borderRadius: 24,
    //         }}
    //         onPress={() => {}}
    //       >
    //         <FontAwesomeIcon icon={faShare} color='#FFFFFFB2' size={24} />
    //       </Pressable>

    //       <Pressable
    //         style={{
    //           backgroundColor: '#2E2E2E',
    //           paddingVertical: 12,
    //           borderRadius: 24,
    //           flex: 2,
    //         }}
    //         onPress={() => {
    //           setMetadata({});
    //           router.replace('/');
    //         }}
    //       >
    //         <Text
    //           style={{
    //             color: '#FFF',
    //             textAlign: 'center',
    //             fontSize: 16,
    //             fontWeight: 'bold',
    //             lineHeight: 24,
    //           }}
    //         >
    //           Done
    //         </Text>
    //       </Pressable>
    //     </View>
    //   </View>
    // </SafeAreaView>
    <View style={{ backgroundColor: '#000', flex: 1 }}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 90,
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: 31,
          }}
        >
          {/* <FontAwesomeIcon icon={faCheckCircle} size={24} color='#9DFF50' /> */}
          <Text
            style={{
              color: '#fff',
              fontFamily: 'Work Sans',
              fontSize: 20,
              fontWeight: '500',
              lineHeight: 20,
              letterSpacing: -0.08,
              marginBottom: 20
            }}
          >
            Added a new location
          </Text>
          <Text
            style={{
              color: '#99FF48',
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 14,
            }}
          >
            you will get reward if validated by community
          </Text>

        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#595959',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 12,
          }}
        >
          <Text
            style={{
              color: '#FFF',
              fontSize: 20,
              fontWeight: '700',
              lineHeight: 40,
              letterSpacing: -0.08,
            }}
          >
            {metadata.name}
          </Text>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.70)',
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 16,
              letterSpacing: -0.08,
              marginBottom: 24,
            }}
            numberOfLines={1}
          >
            {metadata.location}
          </Text>
          <Image
            style={{ width: width, height: width }}
            source={{
              uri: metadata.image.uri,
            }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: '#595959',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            paddingTop: 20,
            marginBottom: 30
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#2E2E2E',
              borderRadius: 24,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              width: widthScreen * 0.234,
            }}
          >
            <FontAwesomeIcon icon={faShare} size={24} color='#FFFFFFB2' />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#2E2E2E',
              borderRadius: 24,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              width: widthScreen * 0.6266,
            }}
            onPress={() => {
              const id = metadata?.dropId;
              setMetadata({});
              console.log(id);
              router.replace(`/detail/${id}`);
            }}
          >
            <Text
              style={{
                color: '#FFF',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                lineHeight: 24,
              }}
            >
              Check status
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DropSuccess;
