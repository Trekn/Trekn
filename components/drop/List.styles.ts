import { StyleSheet } from 'react-native';
import { screenWidth as width } from './constants';

const screenWidth = width / 4 - 1;

const styles = StyleSheet.create({
  Image: {
    width: screenWidth,
    height: screenWidth,
    resizeMode: 'cover',
    marginRight: 1,
  },
  Selected_Image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  Text: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: 'black',
  },
  Selected: {
    position: 'absolute',
    top: 2,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
