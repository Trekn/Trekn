import { useAuthContext } from '@/context/AuthContext';
import { getDropByID } from '@/middleware/data/drop';
import { supabase } from '@/utils/supabaseClients';
import { faPlus, faPlusCircle, faPlusMinus, faTimesCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Keyboard, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableHighlight, View } from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import CustomDrawer from '@/components/CustomDrawer';
import useApi from '@/hooks/useAPI';
import { uploadImage } from '@/functions/uploadImage';
import { createMinted } from '@/middleware/data/minted';
import LoadingSpinner from '@/components/LoadingSpinner';
import { checkNftImage } from '@/middleware/data/nftimage';

export default function CheckinWPhoto() {
  const { id: dropId } = useLocalSearchParams();
  const { setMetadata, metadata } = useAuthContext();
  const user = useSelector((state: any) => state.user);
  const userAccountData = useSelector((state: any) => state.account);
  const dispatch = useDispatch();
  const [files, setFiles] = useState<any | null>(null);
  const [desc, setDesc] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectNftDrawerOpen, setSelectNftDrawerOpen] = useState<boolean>(false);
  const [listNft, setListNft] = useState<Array<any>>([]);
  const [selectedNft, setSelectedNft] = useState<any>(null);
  const { get } = useApi();

  useEffect(() => {
    (async () => {
      if (user.address) {
        const data: any = await get(`https://api.shyft.to/sol/v1/wallet/get_portfolio?network=mainnet-beta&wallet=${user.address}`);
        const nftDataList = data?.result?.nfts;
        await Promise.all(
          nftDataList.map(async (item: any, idx: number) => {
            if (item.uri) {
              const nftData: any = await get(item.uri);
              nftDataList[idx].image = nftData?.properties?.files[0];
              return item;
            }
            return item;
          }))
        setListNft(nftDataList);
      }
    }
    )()
  }, [])

  useEffect(() => {
    (async () => {
      if (dropId) {
        const drop: any = await getDropByID({
          dropId,
        })
        setSelectedLocation(drop[0]);
      }
    })()
  }, [])

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files[0]);
    }
  };

  const handleSelectNft = async (item: any) => {
    const nftData = { address: item.address, image: item?.image?.uri };
    const image = await checkNftImage(nftData);
    setSelectedNft({ address: item.address, image });
    setSelectNftDrawerOpen(false);
  }

  const handleSubmit = async () => {
    if (user.address) {
      setLoading(true)
      let imageUrl: string | undefined;

      if (files) {
        imageUrl = `https://${process.env.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.EXPO_PUBLIC_AWS_REGION}.amazonaws.com/data/${files[0].fileName}`
        await uploadImage(files[0]);
        await createMinted({
          userId: user.id,
          drop: selectedLocation,
          image: imageUrl,
          description: desc,
          imageNft: selectedNft?.image,
        })
        setMetadata({ ...metadata, name: selectedLocation.name, image: imageUrl, imageNft: selectedNft?.image, location: selectedLocation.location })
        router.replace('/check-in/success')
      }

      // await mintCompressedNFT({
      //   drop: selectedLocation,
      //   userAddress: new PublicKey(user.address),
      //   userId: user.id,
      //   ...(imageUrl && { image: imageUrl }),
      //   ...(desc && { description: desc }),
      //   onSuccess: (data: any, sig: any, { point, weeklyPoint }) => {
      //     setMetadata({
      //       sig,
      //       ...selectedLocation,
      //       ...(imageUrl && { image: imageUrl }),
      //       ...(desc && { description: desc }),
      //     });
      //     if (user.id === userAccountData.id) {
      //       dispatch(setAccountData({
      //         ...userAccountData, minted: [...userAccountData.minted,
      //         {
      //           drop: selectedLocation,
      //           ...data,
      //           user,
      //           ...(imageUrl && { image: imageUrl }),
      //           ...(desc && { description: desc }),
      //         }]
      //       }))
      //     }
      //     dispatch(updateUser({ point, weeklyPoint }))
      //     navigate('/collect-success');
      //   },
      //   onError: (error) => {
      //     Modal.error({
      //       title: 'Error',
      //       content: error,
      //       okButtonProps: {
      //         type: 'default',
      //         style: {
      //           background: 'red',
      //           color: 'white',
      //         },
      //       },
      //     });
      //   },
      // });
    }
  }

  const pickImageAsync = async () => {
    setLoading(true);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 9,
    });

    if (!result.canceled) {
      setFiles(result.assets);
    }
    setLoading(false);
  };

  return (
    <>
      <ScrollView
        style={{ width: '100%', height: Dimensions.get('screen').height - (StatusBar.currentHeight || 45), backgroundColor: 'black' }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
          <View
            style={{
              marginBottom: 24,
              padding: 20,
              paddingBottom: 0
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 24,
                fontWeight: '600',
                lineHeight: 40
              }}>
              Checkin
            </Text>
          </View>
          <View style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {files ? (
              <View
                style={{
                  width: '100%',
                  height: 343,
                  marginBottom: 24,
                  marginHorizontal: -20,
                  borderRadius: 12,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1F1F1F'
                }}
              >
                <Image
                  source={{ uri: files[0].uri }}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
                {selectedNft &&
                  <Image
                    source={{ uri: selectedNft.image }}
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: 'cover',
                      position: 'absolute',
                      left: 16,
                      bottom: 0,
                      zIndex: 40,
                    }}
                  />
                }
                <TouchableHighlight
                  onPress={() => setSelectNftDrawerOpen(true)}
                  style={{
                    position: 'absolute',
                    left: 16,
                    bottom: 16,
                    zIndex: 50,
                    backgroundColor: '#2E2E2E50',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 24,
                  }}
                >
                  {!selectedNft ?
                    <View style={
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        columnGap: 8
                      }
                    }>
                      <FontAwesomeIcon icon={faPlus}
                        size={12}
                        color='#FFFFFF'
                        style={{
                          opacity: 70
                        }}
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 13,
                          fontWeight: '600'
                        }}
                      >
                        NFT sticker
                      </Text>
                    </View>
                    :
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 13,
                        fontWeight: '600'
                      }}
                    >
                      Change NFT
                    </Text>
                  }
                </TouchableHighlight>
              </View>
            ) : (
              <View
                style={{
                  width: 200,
                  height: 200,
                  marginBottom: 24,
                  marginHorizontal: -20,
                  borderRadius: 12,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1F1F1F'
                }}
              >
                <TouchableHighlight
                  onPress={() => {
                    pickImageAsync();
                  }}>
                  <FontAwesomeIcon icon={faPlusCircle} size={32} style={{ opacity: 70 }} color='white' />
                </TouchableHighlight>
              </View>
            )}
          </View>
          <View style={{
            padding: 20,
          }}>
            <View
              style={{
                marginBottom: 98
              }}>
              <Text
                style={{
                  fontSize: 13,
                  color: '#BDBDBA',
                  fontWeight: '500',
                  lineHeight: 16
                }}>
                Description
              </Text>
              <OutsidePressHandler
                onOutsidePress={() => {
                  Keyboard.dismiss()
                }}
              >
                <TextInput
                  value={desc}
                  placeholder='Write something about this place...'
                  onChangeText={(value) => setDesc(value)}
                  placeholderTextColor={'rgba(255, 255, 255, 0.50)'}
                  style={{
                    paddingTop: 16,
                    paddingHorizontal: 12,
                    width: '100%',
                    height: 120,
                    fontSize: 16,
                    backgroundColor: '#212121de',
                    color: 'white',
                    borderRadius: 12,
                    marginTop: 8,
                    textAlignVertical: 'top'
                  }}
                  multiline
                  numberOfLines={4}
                />
              </OutsidePressHandler>
            </View>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 'auto',
                marginBottom: 20
              }}>
              <TouchableHighlight
                style={{
                  width: (Dimensions.get('screen').width - 40 - 12) / 2,
                  backgroundColor: '#2C2C2C',
                  paddingVertical: 12,
                  minHeight: 48,
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => router.replace('/check-in/nearby')}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 16,
                    color: 'white'
                  }}>
                  Cancel
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  backgroundColor: loading ? '#898989' : files && desc ? '#99FF48' : '#2E2E2E',
                  width: (Dimensions.get('screen').width - 40 - 12) / 2,
                  minHeight: 48,
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={handleSubmit}
              >
                {loading ?
                  <LoadingSpinner />
                  :
                  <Text style={{
                    color: files && desc ? 'black' : '#FFFFFF80',
                    fontWeight: '600',
                    fontSize: 16,
                  }}>
                    Confirm
                  </Text>
                }
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <CustomDrawer isOpen={selectNftDrawerOpen} onClose={() => setSelectNftDrawerOpen(false)}
          style={{
            padding: 0,
            backgroundColor: '#2C2C2C',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: '80%',
          }}>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 12,
            marginRight: 16
          }}>
            <TouchableHighlight
              onPress={() => {
                setSelectNftDrawerOpen(false);
              }}>
              <FontAwesomeIcon icon={faXmarkCircle} size={32} style={{ opacity: 70 }} color='white' />
            </TouchableHighlight>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 28,
              paddingHorizontal: 16
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 8
              }}>
              <View style={{
                width: 8,
                height: 8,
                backgroundColor: '#99FF48',
                borderRadius: 999
              }} />
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontWeight: '500',
                }}
              >
                {user.address.slice(0, 2)}...
                {user.address.slice(-6, -1)}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginTop: 12,
              paddingLeft: 16,
              fontSize: 20,
              fontWeight: '700',
              color: 'white'
            }}>
            Select your NFT
          </Text>
          <View style={{
            marginTop: 12,
            paddingHorizontal: 20,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: 20,
            rowGap: 12
          }}>
            {listNft.map((item: any, idx: number) =>
              <TouchableHighlight
                key={idx}
                onPress={() => handleSelectNft(item)}
                style={{
                  width: (Dimensions.get('window').width - 20) / 3 - 20,
                  height: 128,
                }}
              >
                <>
                  <Image
                    source={{ uri: item?.image?.uri }}
                    style={{
                      height: 100,
                      width: '100%',
                      backgroundColor: '#ccc',
                      borderRadius: 4,
                      resizeMode: 'cover',
                    }} />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: '500',
                      color: 'white',
                      lineHeight: 24,
                      marginTop: 4
                    }}
                    numberOfLines={1}
                  >
                    {item?.name}
                  </Text>
                </>
              </TouchableHighlight>
            )}
          </View>
        </CustomDrawer>
      </ScrollView>
    </>
  );
}
