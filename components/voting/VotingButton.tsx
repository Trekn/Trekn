import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface VotingButtonProps {
    type: string;
    handleVote: () => void
}

export default function VotingButton({ type, handleVote }: VotingButtonProps) {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: 'black',
                paddingHorizontal: 28,
                paddingVertical: 16,
                borderRadius: 12,
                width: 148,
                flexDirection: 'row',
                justifyContent: 'center',
            }}
            onPress={handleVote}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 8
                }}
            >
                <FontAwesomeIcon icon={type === 'like' ? faThumbsUp : faThumbsDown} size={16} color='white' />
                <Text
                    style={{
                        fontSize: 14,
                        lineHeight: 16,
                        fontWeight: '600',
                        color: 'white',
                    }}
                >
                    {type === 'like' ?
                        'Upvote'
                        :
                        'Downvote'
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
}
