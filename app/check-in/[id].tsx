import { useAuthContext } from '@/context/AuthContext';
import { getDropByID } from '@/middleware/data/drop';
import { supabase } from '@/utils/supabaseClients';
import {
  faArrowLeft,
  faCheckCircle,
  faPlus,
  faPlusCircle,
  faPlusMinus,
  faTimesCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AirbnbRating } from 'react-native-ratings';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import CustomDrawer from '@/components/CustomDrawer';
import useApi from '@/hooks/useAPI';
import { uploadImage } from '@/functions/uploadImage';
import { createMinted } from '@/middleware/data/minted';
import LoadingSpinner from '@/components/LoadingSpinner';
import { checkNftImage } from '@/middleware/data/nftimage';
import { randomNumber } from '@/utils/drop.util';
import { addReaction } from '@/middleware/data/reaction';

export default function CheckinWPhoto() {
  const { id: dropId } = useLocalSearchParams();
  const { setMetadata, metadata } = useAuthContext();
  const user = useSelector((state: any) => state.user);
  const userAccountData = useSelector((state: any) => state.account);
  const dispatch = useDispatch();
  const [desc, setDesc] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectNftDrawerOpen, setSelectNftDrawerOpen] = useState<boolean>(false);
  const [listNft, setListNft] = useState<Array<any>>([]);
  const [selectedNft, setSelectedNft] = useState<any>(null);
  const { get } = useApi();
  const width = Dimensions.get('screen').width;
  const [rating, setRating] = useState(0);

  useEffect(() => {
    (async () => {
      if (user.address) {
        const data: any = await get(
          `https://api.shyft.to/sol/v1/wallet/get_portfolio?network=mainnet-beta&wallet=${user.address}`
        );
        const nftDataList = data?.result?.nfts;
        await Promise.all(
          nftDataList.map(async (item: any, idx: number) => {
            if (item.uri) {
              const nftData: any = await get(item.uri);
              console.log(nftData);
              nftDataList[idx].image = nftData?.properties?.files[0] || { uri: nftData?.image };
              console.log(nftDataList[idx].image)
              return item;
            }
            return item;
          })
        );
        setListNft(nftDataList);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (dropId) {
        const drop: any = await getDropByID({
          dropId,
        });
        setSelectedLocation(drop);
      }
    })();
  }, []);

  const handleSelectNft = async (item: any) => {
    const nftData = { address: item.address, image: item?.image?.uri };
    const image = await checkNftImage(nftData);
    setSelectedNft({ address: item.address, image });
    setSelectNftDrawerOpen(false);
  };

  const handleSubmit = async () => {
    if (user.address) {
      setLoading(true);
      let imageUrl: string | undefined;

      if (metadata.image) {
        const image = metadata.image;
        const fileName = `${randomNumber().toString()}.jpg`;

        imageUrl = `https://${process.env.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.EXPO_PUBLIC_AWS_REGION}.amazonaws.com/data/${fileName}`;
        await uploadImage({
          ...image,
          fileName,
        });

        const { data: reaction } = await addReaction({
          dropId: selectedLocation.id,
          userId: user.id,
          value: rating,
        });

        await createMinted({
          reaction_id: reaction.id,
          userId: user.id,
          drop: selectedLocation,
          image: imageUrl,
          description: desc,
          imageNft: selectedNft?.image,
        });

        setMetadata({
          ...metadata,
          name: selectedLocation.name,
          imageNft: selectedNft?.image,
          location: selectedLocation.location,
        });

        setLoading(true);

        router.replace('/check-in/success');
      }
    }
  };

  return (
    <>
      <ScrollView
        style={{
          paddingTop: 4,
          backgroundColor: 'black',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            marginTop: 50,
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
              marginHorizontal: 20,
            }}
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
              Checkin
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: width - 40,
                height: width - 40,
                marginBottom: 24,
                marginHorizontal: -20,
                borderRadius: 12,
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1F1F1F',
              }}
            >
              <Image
                source={{ uri: metadata.image.uri }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
              {selectedNft && (
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
              )}
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
                {!selectedNft ? (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 8,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      size={12}
                      color='#FFFFFF'
                      style={{
                        opacity: 70,
                      }}
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      NFT sticker
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 13,
                      fontWeight: '600',
                    }}
                  >
                    Change NFT
                  </Text>
                )}
              </TouchableHighlight>
            </View>
          </View>
          <View
            style={
              {
                // padding: 20,
              }
            }
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#505050',
                borderStyle: 'solid',
                paddingBottom: 24,
                marginBottom: 24,
              }}
            >
              <OutsidePressHandler
                onOutsidePress={() => {
                  Keyboard.dismiss();
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
                    fontSize: 16,
                    color: 'white',
                    borderRadius: 12,
                    marginTop: 8,
                    textAlignVertical: 'top',
                  }}
                  multiline
                  numberOfLines={4}
                />
              </OutsidePressHandler>
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#505050',
                borderStyle: 'solid',
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  color: '#BDBDBA',
                  fontSize: 13,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: 15.6,
                  marginBottom: 12,
                }}
              >
                Checkin at
              </Text>

              <View
                style={{
                  backgroundColor: 'rgba(33, 33, 33, 0.87)',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 19.2,
                    borderRadius: 12,
                  }}
                >
                  {selectedLocation?.name}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 24,
                }}
              >
                <Text
                  style={{
                    color: '#BDBDBA',
                    fontSize: 13,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 15.6,
                    marginBottom: 12,
                    marginRight: 10,
                  }}
                >
                  Rate this place
                </Text>

                <AirbnbRating
                  count={5}
                  defaultRating={5}
                  size={24}
                  showRating={false}
                  onFinishRating={(rating) => {
                    setRating(rating);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 'auto',
                marginBottom: 20,
                marginHorizontal: 20,
              }}
            >
              <TouchableHighlight
                style={{
                  backgroundColor: loading
                    ? '#898989'
                    : desc
                      ? '#99FF48'
                      : '#2E2E2E',
                  width: width - 40,
                  minHeight: 48,
                  borderRadius: 24,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleSubmit}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      size={16}
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 16,
                      }}
                    >
                      Confirm
                    </Text>
                  </>
                )}
              </TouchableHighlight>
            </View>
          </View>
        </View>

        <CustomDrawer
          isOpen={selectNftDrawerOpen}
          onClose={() => setSelectNftDrawerOpen(false)}
          style={{
            padding: 0,
            backgroundColor: '#2C2C2C',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: '80%',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 12,
              marginRight: 16,
            }}
          >
            <TouchableHighlight
              onPress={() => {
                setSelectNftDrawerOpen(false);
              }}
            >
              <FontAwesomeIcon
                icon={faXmarkCircle}
                size={32}
                style={{ opacity: 70 }}
                color='white'
              />
            </TouchableHighlight>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 28,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 8,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#99FF48',
                  borderRadius: 999,
                }}
              />
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
              color: 'white',
            }}
          >
            Select your NFT
          </Text>
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 20,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              columnGap: 20,
              rowGap: 12,
            }}
          >
            {
              listNft?.length === 0 &&
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  color: 'white',
                }}
              >
                no NFT scanned
              </Text>
            }
            {listNft.map((item: any, idx: number) => (
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
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: '500',
                      color: 'white',
                      lineHeight: 24,
                      marginTop: 4,
                    }}
                  numberOfLines={1}
                  >
                    {item?.name}
                    {/* {JSON.stringify(item?.image)} */}
                  </Text>
                </>
              </TouchableHighlight>
            ))}
          </View>
        </CustomDrawer>
      </ScrollView>
    </>
  );
}
