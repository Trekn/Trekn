import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useAuthContext } from '../context/AuthContext';

interface DefaultBlackBgProps {
    children: ReactNode;
    style?: any; // You can replace 'any' with a more specific style type if needed
}

export default function DefaultBlackBg({ style, children }: DefaultBlackBgProps) {
    const { windowSize } = useAuthContext();

    return (
        <View style={[styles.container, { width: windowSize.width, height: windowSize.height }, style]}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {children}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});
