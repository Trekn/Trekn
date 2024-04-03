import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

export default function Voting({ votingData }: any) {
    const [date, setDate] = useState(() => {
        console.log(votingData);
        // const date = new Date(votingData?.created_at);
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date;
    });

    const [countdown, setCountdown] = useState<any>(null);

    useEffect(() => {
        const countdownTime = setInterval(() => {
            const updatedDate: any = new Date(date);

            const remainingSeconds = Math.floor((updatedDate - Date.now()) / 1000);

            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;

            const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            setCountdown(formattedCountdown);
        }, 1000);

        return () => clearInterval(countdownTime);
    }, []);

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <View>
                <Text
                    style={{
                        fontSize: 13,
                        lineHeight: 16,
                        fontWeight: '500',
                        color: '#020303'
                    }}
                >Community voting</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        columnGap: 8,
                        marginTop: 8
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            columnGap: 4
                        }}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} color='#57C500' size={16} />
                        <Text>{votingData?.like || 0}</Text>
                    </View>
                    <View
                        style={{
                            width: 4,
                            height: 4,
                            borderRadius: 999,
                            backgroundColor: 'black'
                        }}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            columnGap: 4
                        }}
                    >
                        <FontAwesomeIcon icon={faThumbsDown} color='#FE3F3F' size={16} />
                        <Text>{votingData?.unlike || 0}</Text>
                    </View>
                </View>
            </View>
            <Text
                style={{
                    fontWeight: '500',
                    lineHeight: 16,
                    color: '#020303'
                }}
            >{countdown}</Text>
        </View>
    )
}
