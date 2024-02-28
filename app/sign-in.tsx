import React, { useState } from 'react';
import {
    ImageBackground,
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    Image,
    Modal,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useAuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignIn() {
    //   const { signIn } = useSession();
    const { signIn } = useAuthContext()
    const [isModalErrorVisible, setModalErrorVisible] = useState(false);
    const [error, setError] = useState('');
    const toggleModal = () => {
        setModalErrorVisible(!isModalErrorVisible);
    };

    return (
        <SafeAreaView style={{ height: Dimensions.get('screen').height }}>
            <Modal
                animationType='slide'
                transparent={true}
                visible={isModalErrorVisible}
                onRequestClose={() => {
                    toggleModal();
                }}
            >
                <Text>Testing</Text>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>{error}</Text>
                        <TouchableOpacity onPress={toggleModal}>
                            <Text style={styles.okButton}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <ImageBackground
                source={require('../assets/images/test-bg.png')} // Replace with the actual path to your image
                style={{
                    flex: 1,
                    width: '100%',
                    height: '60%',
                    justifyContent: 'center',
                }}
            >
                <LinearGradient
                    colors={['rgba(79, 255, 75, 0.30)', '#000']}
                    locations={[0, 0.6]}
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                ></LinearGradient>
                <View
                    style={{
                        flex: 1,
                        marginTop: 362,
                        marginHorizontal: 20,
                    }}
                >
                    <Text style={styles.title}>Discover &{'\n'}checkin to earn</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                            await signIn('google');
                        }}
                    >
                        <Image source={require('../assets/images/Google.png')} />
                        <Text style={styles.button_text}>Continue with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} disabled>
                        <FontAwesomeIcon size={16} color='white' icon={faPhone} />
                        <Text style={styles.button_text}>Continue with phone number</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} disabled>
                        <Image source={require('../assets/images/Facebook.png')} />
                        <Text style={styles.button_text}>Continue with facebook</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        height: 48,
        paddingVertical: 12,
        paddingHorizontal: 18,
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'stretch',
        borderRadius: 117.791,
        borderWidth: 1.305,
        borderColor: 'rgba(180, 180, 180, 0.61)',
        marginBottom: 16,
    },
    button_text: {
        marginLeft: 12,
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Work Sans',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 16,
        letterSpacing: -0.64,
    },
    title: {
        color: '#FFF',
        fontSize: 32,
        fontStyle: 'normal',
        fontWeight: '800',
        lineHeight: 38.4,
        letterSpacing: -0.118,
        marginBottom: 40,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    okButton: {
        marginTop: 20,
        color: 'blue',
    },
});