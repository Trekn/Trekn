import React, { useRef, useState } from 'react';
import { useOnClickOutside } from '../../hooks/useClickOutSite';
import { capitalizeFirstLetter } from '../../functions/text';
import { Pressable, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../context/AuthContext';
import OutsidePressHandler from 'react-native-outside-press';

export default function CustomSelect({
  placeholder,
  defaultValue = '',
  options,
  onChange,
  recommend,
}: any) {
  const ref: any = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const [value, setValue] = useState(defaultValue);

  return (
    <OutsidePressHandler
      onOutsidePress={() => {
        setIsOpen(false);
      }}
    >
      <View
        style={{ position: 'relative' }} ref={ref}>
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 16,
            alignItems: 'center',
            backgroundColor: '#212121de',
            borderRadius: 12,
            width: '100%'
          }}
          onPress={() => setIsOpen((prev) => !prev)}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: 'white',
              lineHeight: 19,
              opacity: !value ? 50 : 100
            }}
          >
            {value ? value : placeholder}
          </Text>
          <FontAwesomeIcon size={16} icon={faChevronDown} color='white' />
        </Pressable>
        {recommend && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 8,
            }}
          >
            {options.slice(0, 3).map((option: any, idx: number) => (
              <Pressable
                key={idx}
                style={{
                  padding: 8,
                  backgroundColor: '#99FF4833',
                  borderRadius: 999
                }}
                onPress={() => {
                  setIsOpen(false);
                  setValue(capitalizeFirstLetter(option.type));
                  onChange(option.id);
                }}
              >
                <Text
                  style={{
                    color: '#99FF48',
                    lineHeight: 24,
                    fontWeight: '500',
                    fontSize: 13,
                  }}
                >
                  {capitalizeFirstLetter(option.type)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        {isOpen && (
          <ScrollView
            style={{
              height: 200,
              overflow: 'scroll',
              paddingHorizontal: 12,
              backgroundColor: '#212121de',
              borderRadius: 12,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50
            }}
          >
            {options.map((option: any, idx: number) => (
              <Pressable
                key={idx}
                style={{
                  paddingVertical: 8
                }}
                onPress={() => {
                  setIsOpen(false);
                  setValue(capitalizeFirstLetter(option.type));
                  onChange(option.id);
                }}
              >
                <Text
                  style={{
                    color: 'white'
                  }}
                >
                  {capitalizeFirstLetter(option.type)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </OutsidePressHandler>
  );
}
