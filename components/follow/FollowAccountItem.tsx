import { prominent } from 'color.js';
import React, { useEffect, useState } from 'react'
import { unFollowUser } from '../../middleware/data/follow';
import { useDispatch, useSelector } from 'react-redux';
import { updateInit } from '../../redux/slides/userSlides';
import { TouchableOpacity, View } from 'react-native';

export default function FollowAccountItem({ item, userId, key, type }: any) {
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const [borderColor, setBorderColor] = useState<any>("");

    useEffect(() => {
        getColorBorder(item.profileImage);
    }, [item])

    const getColorBorder = async (url: string) => {
        const color = await prominent(url, { amount: 1, format: 'hex' })
        setBorderColor(color);
    }

    const handleUnfollow = async () => {
        await unFollowUser({
            follower: user.id, following: item.id, onSuccess: () => {
                const newFollowList = user.following.filter((followItem: any) => followItem !== item.id);
                dispatch(updateInit({ following: newFollowList }));
            }
        })
    }

    return (
        <View className="flex items-center justify-between" key={key}>
            <View className="flex items-center gap-[10px] w-1/2">
                <View className={`rounded-full p-[1px] w-12 h-12 overflow-hidden border box-content`}
                    style={{ borderColor }}>
                    <img src={item.profileImage} alt="" className='w-full h-full object-center object-cover rounded-full' />
                </View>
                <View className="font-medium text-base leading-5 w-1/2 text-ellipsis overflow-hidden whitespace-nowrap">{item.name}</View>
            </View>
            {type === 'following' && !userId ?
                <TouchableOpacity className="p-4 text-base font-medium leading-[11px] rounded-full bg-[#F5F5F5]" onPress={handleUnfollow}>Unfollow</TouchableOpacity>
                :
                <View className="px-3 py-2 text-[13px] font-medium leading-[9px] text-[#828282] rounded-full bg-[#F5F5F5]">
                    {item.address.slice(0, 2)}...
                    {item.address.slice(-6, -1)}
                </View>
            }
        </View>
    )
}
