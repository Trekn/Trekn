// image-upload-styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  imageContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 2.5,
    flexDirection: 'column',
    marginBottom: 6,
  },
  imageWrapper: {
    position: 'relative',
    margin: 1.5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    flex: 1,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    marginBottom: 4,
    width: '100%',
  },
  editButtonText: {
    color: '#99FF48',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  shaking: {
    animationName: 'shake',
    animationDuration: '0.5s',
    animationIterationCount: 'infinite',
    transform: [{ translateX: 0 }],
  },
  continueButton: {
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  placeholderContainer: {
    position: 'relative',
    padding: 6,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    width: '100%',
    marginBottom: 62,
  },
  placeholderImage: {
    width: 177,
    height: 197,
    alignSelf: 'center',
  },
  placeholderText: {
    marginTop: 4,
    fontSize: 13,
    color: '#FFFFFFB2',
    textAlign: 'center',
    fontFamily: 'System',
  },
  uploadButton: {
    position: 'relative',
    backgroundColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
