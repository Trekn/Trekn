import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, StyleSheet, Animated } from 'react-native';

const CustomDrawer = ({ isOpen, onClose, children, style }: any) => {
  const [slideAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnimation]);

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isOpen}
      onRequestClose={() => onClose()}
    >
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.drawerContainer,
          style,
          {
            transform: [
              {
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0], // Customize the starting and ending positions
                }),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    minHeight: 200,
    bottom: 0,
    width: '100%', // Customize the width as needed
    backgroundColor: 'white',
    padding: 16,
  },
});

export default CustomDrawer;
