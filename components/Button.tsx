import {
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { COLORS } from '../constants';
import React from 'react';

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={disabled ? [styles.button, styles.disabled] : styles.button}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 60,
    elevation: 3,
    backgroundColor: COLORS.PURPLE,
  },
  disabled: {
    backgroundColor: COLORS.GREY_2,
  },
  text: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});
