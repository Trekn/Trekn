import React from 'react';
import { View, Text, TextInput, Keyboard } from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';

interface CustomiseInputWIcoProps {
  label: string | null;
  onChange: CallableFunction;
  value?: string;
  itemKey?: string;
  style?: string;
  placeholder?: string;
  leftIco?: React.ReactNode;
}

export default function CustomiseInputWIco({
  value = '',
  label,
  onChange,
  style = 'light',
  placeholder,
  leftIco,
}: CustomiseInputWIcoProps) {
  return (
    <OutsidePressHandler
      onOutsidePress={() => {
        Keyboard.dismiss()
      }}
    >
      <View>
        {label && (
          <Text
            style={{
              fontSize: 13,
              color: '#000000b3',
              fontWeight: 'bold',
              marginBottom: 4,
              marginRight: 8,
            }}
          >
            {label}
          </Text>
        )}
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: style === 'dark' ? '#212121de' : 'transparent',
            borderWidth: style === 'dark' ? 0 : 1,
            borderColor: '#000000',
          }}
        >
          {leftIco}
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: style === 'dark' ? '#ffffff' : '#000000',
              backgroundColor: 'transparent',
              textAlignVertical: 'center',
            }}
            placeholderTextColor={style === 'dark' ? '#ffffff50' : '#00000050'}
            onChangeText={(text) => onChange(text)}
            value={value}
            placeholder={placeholder}
          />
        </View>
      </View>
    </OutsidePressHandler>
  );
}
