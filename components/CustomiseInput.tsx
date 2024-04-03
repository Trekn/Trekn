import React, { useEffect, useRef } from 'react';
import { TextInput, View, Text, Keyboard } from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';

interface CustomiseInputProps {
    type?: string;
    value: string;
    label: string;
    itemKey: string;
    onChange: CallableFunction;
}

export default function CustomiseInput({ type = 'input', value = '', label, onChange, itemKey }: CustomiseInputProps) {
    const textAreaRef: any = useRef(null);

    const resizeTextArea = () => {
        if (textAreaRef.current && textAreaRef.current.scrollHeight >= 128) {
            textAreaRef.current.setNativeProps({
                height: 'auto',
            });
        }
    };

    useEffect(() => {
        if (type === 'textarea') {
            resizeTextArea();
        }
    }, [value]);

    const handleOnChange = (text: string) => {
        onChange(itemKey, text);
    };

    return (
        <OutsidePressHandler
            onOutsidePress={() => {
                Keyboard.dismiss()
            }}
        >
            <View>
                <Text style={{ fontSize: 13, color: '#000000b3', fontWeight: 'bold', marginBottom: 4 }}>{label}</Text>
                <View style={{ borderWidth: 1, borderRadius: 8, overflow: 'hidden', marginTop: 4 }}>
                    {type === 'input' && (
                        <TextInput
                            style={{ paddingVertical: 12, paddingHorizontal: 12, fontSize: 16 }}
                            onChangeText={(text) => handleOnChange(text)}
                            value={value}
                        />
                    )}
                    {type === 'textarea' && (
                        <TextInput
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 12,
                                fontSize: 16,
                                height: 32,
                                textAlignVertical: 'top',
                            }}
                            multiline
                            onContentSizeChange={resizeTextArea}
                            ref={textAreaRef}
                            onChangeText={(text) => handleOnChange(text)}
                            value={value}
                        />
                    )}
                </View>
            </View>
        </OutsidePressHandler>
    );
}
