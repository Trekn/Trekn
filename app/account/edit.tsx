import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, Image, Keyboard, SafeAreaView, StatusBar, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useDispatch, useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import OutsidePressHandler from 'react-native-outside-press'
import { useAuthContext } from '@/context/AuthContext'
import { updateUser } from '@/redux/slides/userSlides'
import { updateUserDB } from '@/middleware/data/user'
import { uploadImage } from '@/functions/uploadImage'

export default function EditProfile() {
    const { signOut } = useAuthContext()
    const user = useSelector((state: any) => state.user)
    const dispatch = useDispatch();
    const [name, setName] = useState<any>(null);
    // const [desc, setDesc] = useState<any>(null);
    const [updateAvatar, setUpdateAvatar] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [imageloading, setImageLoading] = useState(false);

    const pickImageAsync = async () => {
        setImageLoading(true);
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
            selectionLimit: 1,
        });

        if (!result.canceled) {
            setUpdateAvatar(result.assets[0]);
        }
        setImageLoading(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let profileImage;
            if (updateAvatar) {
                profileImage = `https://${process.env.EXPO_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.EXPO_PUBLIC_AWS_REGION}.amazonaws.com/data/${updateAvatar.fileName}`
                await uploadImage(updateAvatar);
            }
            await updateUserDB({
                userId: user.id,
                updateData: {
                    name,
                    // description: desc,
                    ...(updateAvatar && { profileImage })
                },
                onSuccess: (data) => {
                    dispatch(updateUser(data));
                }
            })
            router.replace('/account/0');
        } catch (e: any) {
            Alert.alert(e);
        }
        setLoading(false);
    }

    useEffect(() => {
        setName(user.name)
        // setDesc(user.description)
    }, [])
    if (imageloading || loading) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: '#000000',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: Dimensions.get('screen').height - (StatusBar.currentHeight || 40)
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
                    Loading...
                </Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
            <View
                style={{
                    padding: 20,
                    flex: 1
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            left: 0
                        }}
                        onPress={() => { router.replace('/account/0') }}
                    >
                        <Svg
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                        >
                            <Path
                                d='M9.21347 13.9093L8.51972 14.6031C8.22597 14.8968 7.75097 14.8968 7.46035 14.6031L1.38535 8.5312C1.0916 8.23745 1.0916 7.76245 1.38535 7.47183L7.46035 1.39683C7.7541 1.10308 8.2291 1.10308 8.51972 1.39683L9.21347 2.09058C9.51035 2.38745 9.5041 2.87183 9.20097 3.16245L5.43535 6.74995H14.4166C14.8322 6.74995 15.1666 7.08433 15.1666 7.49995V8.49995C15.1666 8.91558 14.8322 9.24996 14.4166 9.24996H5.43535L9.20097 12.8375C9.50722 13.1281 9.51347 13.6125 9.21347 13.9093Z'
                                fill='black'
                                fillOpacity='0.7'
                            />
                        </Svg>
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '600'
                        }}
                    >
                        Edit Profile
                    </Text>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    rowGap: 16,
                    marginTop: 20
                }}>
                    <Image
                        style={{
                            borderRadius: 999,
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            backgroundColor: '#ccc'
                        }}
                        source={{ uri: updateAvatar ? updateAvatar.uri : user.profileImage }}
                    />
                    <TouchableHighlight
                        onPress={pickImageAsync}>
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 16,
                                fontWeight: '500',
                            }}
                        >
                            Edit avatar
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={{
                    flexDirection: 'column',
                    gap: 20,
                    marginTop: 20,
                    flex: 1
                }}>
                    <View>
                        <Text
                            style={{
                                fontSize: 13,
                                color: '#00000070',
                                fontWeight: 'bold',
                                marginBottom: 8,
                            }}
                        >
                            Name
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
                                    placeholder='Name'
                                    placeholderTextColor={'#00000070'}
                                    onChangeText={(value) => {
                                        setName(value);
                                    }}
                                    style={{
                                        paddingVertical: 16,
                                        paddingHorizontal: 12,
                                        width: '100%',
                                        fontSize: 16,
                                        height: 51,
                                        backgroundColor: '#F2F2F270',
                                        color: 'black',
                                    }}
                                />
                            </OutsidePressHandler>
                        </View>
                    </View>

                    {/* <View>
                        <Text
                            style={{
                                fontSize: 13,
                                color: '#00000070',
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
                                    value={desc}
                                    placeholder='Description'
                                    onChangeText={(value) => setDesc(value)}
                                    placeholderTextColor={'#00000070'}
                                    style={{
                                        paddingTop: 16,
                                        paddingHorizontal: 12,
                                        width: '100%',
                                        height: 120,
                                        fontSize: 16,
                                        backgroundColor: '#F2F2F270',
                                        color: 'black',
                                        textAlignVertical: 'top'
                                    }}
                                    multiline
                                    numberOfLines={4}
                                />
                            </OutsidePressHandler>
                        </View>
                    </View> */}
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            columnGap: 12,
                            marginTop: 'auto'
                        }}
                    >
                        <TouchableHighlight
                            style={{
                                backgroundColor: 'red',
                                borderRadius: 24,
                                paddingVertical: 12,
                                width: '50%'
                            }}
                            onPress={async () => {
                                Alert.alert("Are you sure you want to delete your account?",
                                    "your data will be dominated.",
                                    [
                                        {
                                            text: 'Delete', onPress: async () => {
                                                setLoading(true);
                                                await updateUserDB({
                                                    userId: user.id,
                                                    updateData: {
                                                        isRemoved: true
                                                    },
                                                    onSuccess: () => { }
                                                })
                                                signOut()
                                            }, style: 'destructive'
                                        },
                                        { text: 'Cancel' },
                                    ],
                                    { cancelable: false }
                                )
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: 16,
                                    lineHeight: 24
                                }}
                            >
                                Delete Account
                            </Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{
                                backgroundColor: 'black',
                                borderRadius: 24,
                                paddingVertical: 12,
                                width: '50%'
                            }}
                            onPress={handleSubmit}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    fontSize: 16,
                                    lineHeight: 24
                                }}
                            >Save</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
