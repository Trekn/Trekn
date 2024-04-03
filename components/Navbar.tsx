import { faHome, faMapMarkerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { usePathname, useRouter } from 'expo-router';
import React from 'react'
import { TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Navbar() {
    const navBarList = [
        {
            name: 'home',
            path: '/',
            element: (active: boolean) => <FontAwesomeIcon icon={faHome} size={24} color={active ? 'black' : '#00000030'}/>
        },
        {
            name: 'map',
            path: '/map',
            element: (active: boolean) => <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color={active ? 'black' : '#00000030'}/>
        },
        {
            name: 'account',
            path: '/account/0',
            element: (active: boolean) => <FontAwesomeIcon icon={faUser} size={24} color={active ? 'black' : '#00000030'}/>
        },
    ]

    const pathname = usePathname();
    const { replace: navigate, push } = useRouter();
    const isShow = () => {
        const allow = ['/', '/account/0', '/map', '/addfriend'];
        return allow.some((e: string) => pathname === e);
    }
    return (
        <>
            {isShow() &&
                <View style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 32,
                        paddingVertical: 20,
                        paddingBottom: 40,
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: 'white',
                        zIndex: 50,
                        borderTopWidth: 1,
                        borderTopColor: '#0000001A',
                    }}>
                    {navBarList.map((item: any,
                        idx: number) => (
                        <TouchableOpacity 
                        key={idx} 
                        onPress={() => navigate(item.path)} 
                        style={{ position: 'relative', paddingHorizontal: 20 }}
                        >
                            {item.element(item.path === pathname)}
                            {item.path === pathname &&
                                <View
                                    style={{
                                        backgroundColor: '#FF5348',
                                        width: 4,
                                        height: 4,
                                        marginTop: 4,
                                        borderRadius: 9999,
                                        marginHorizontal: 10
                                    }} />
                            }
                        </TouchableOpacity>
                    ))}
                </View>
            }
        </>
    )
}
