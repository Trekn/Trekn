import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthContext } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import styles from './ImageUploadStyle';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image } from 'expo-image';

const ImageUpload = () => {
  const { metadata, setMetadata, windowSize } = useAuthContext();
  const navigation = useNavigation();
  const [files, setFiles] = useState(() => {
    const remainingEmptySlots = 9 - (metadata?.imageArray?.length || 0);
    const emptyFiles = Array.from({ length: remainingEmptySlots }, () => null);
    return [...(metadata?.imageArray || []), ...emptyFiles];
  });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileSelectedHandler = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed', // Change to 'photo' for images only
      },
      (response) => {
        if (!response.didCancel) {
          const selectedFiles = response.assets;

          const newFiles = [
            ...files.filter((file) => file?.uri && file),
            ...selectedFiles,
          ].slice(0, 9);

          if (newFiles.length > 9) {
            Alert.alert('Error', 'The number of photos cannot exceed 9!');
            return;
          }

          handleEmpty(newFiles);
        }
      }
    );
  };

  const handleEmpty = (newFiles) => {
    const remainingEmptySlots = 9 - newFiles.length;
    const emptyFiles = Array.from({ length: remainingEmptySlots }, () => null);
    if (emptyFiles.length === 0) {
      setEdit(false);
    }
    setFiles([...newFiles, ...emptyFiles]);
  };

  return (
    <View style={styles.container}>
      {files.length > 0 ? (
        <>
          <View
            style={[
              styles.imageContainer,
              { height: 371, width: windowSize.width - 40 },
            ]}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {files.map((file, index) => (
                <TouchableOpacity
                  style={[
                    styles.imageWrapper,
                    edit && styles.shaking,
                    { width: (windowSize.width - 96) / 3, height: 93 },
                  ]}
                  key={index}
                  onPress={() => {
                    if (edit && file?.uri) {
                      const newItems = [...files];
                      newItems.splice(index, 1);
                      handleEmpty(newItems);
                    }
                  }}
                >
                  {file?.uri ? (
                    <Image
                      source={file.uri}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <FontAwesomeIcon icon={'plus'} size={16} color='#FFFFFFB2' />
                    </View>
                  )}
                  {edit && file?.uri && (
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => {
                        const newItems = [...files];
                        newItems.splice(index, 1);
                        handleEmpty(newItems);
                      }}
                    >
                      <FontAwesomeIcon icon={'times-circle'} size={18} color='#FFFFFF' />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEdit(!edit)}
            >
              <Text style={styles.editButtonText}>
                {edit ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              setLoading(true);
              const imageArray = files.filter((file) => file?.uri);
              setMetadata({
                ...metadata,
                image: imageArray[0],
                imageArray,
              });
              setLoading(false);

              router.replace('/check-in/edit-location');
            }}
          >
            <Text style={styles.continueButtonText}>
              Continue
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.placeholderContainer}>
            <Image
              source={require('/upload-card.png')}
              style={styles.placeholderImage}
            />
            <Text style={styles.placeholderText}>
              Upload images or video to give others a vivid and detailed view of this place.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={fileSelectedHandler}
          >
            <Text style={styles.uploadButtonText}>
              Upload image or video
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ImageUpload;
