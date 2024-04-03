import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuthContext } from '../context/AuthContext';
import CustomiseInput from '../components/CustomiseInput';
import { getAllUserList } from '../middleware/data/user';
import { getWeeklyWinner, updateWeeklyWinner } from '../middleware/data/weeklyWinner';
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapPin, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';
import LoadingSpinner from '@/components/LoadingSpinner';
import { LinearGradient } from 'expo-linear-gradient';

export default function Reward() {
    const user = useSelector((state: any) => state.user);
    const { connectWallet } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState('award')
    const [isWin, setIsWin] = useState<any>(null);
    const [type, setType] = useState<string | null>(null)
    const [wallet, setWallet] = useState('')
    const [discordId, setDiscordId] = useState('')
    const [loading, setLoading] = useState(false)
    const [userList, setUserList] = useState<any[]>([]);
    const placeData = ['/1st.svg', '/2nd.svg', '/3rd.svg']
    const body: any = {
        nft: {
            header: 'You\'ve Got a Trekn NFT',
            desc: 'Congratulations! You\'ve just received a unique Trekn NFT. Check it out in your collection now and see what makes it special.',
            img: '/nft-placeholder.png',
            done: 'Congrats! You\'ve earned an exclusive NFT reward from Trekn. This reward will be sent to you after collection launch date.'
        },
        whitelist: {
            header: 'Welcome to the Whitelist',
            desc: 'Congrats! You\'ve secured a coveted whitelist slot. Your journey with us is just beginning',
            img: '/whitelist.png',
            done: 'Congrats! You\'ve secured a coveted whitelist slot. Your journey with us is just beginning.'
        }
    }

    const handleClose = () => {
        setIsOpen(false);
        setWallet('');
        setTimeout(() => {
            setCurrentView('award');
        }, 200)
    }

    const handleConfirm = async () => {
        await updateWeeklyWinner(isWin, { walletAddress: wallet, discordId });
        setCurrentView('success');
        setIsWin((prev: any) => ({ ...prev, walletAddress: wallet, discordId }))
        setWallet('');
        setDiscordId('');
    }

    useEffect(() => {
        (async () => {
            setLoading(true)
            const userList = await getAllUserList();
            const winner = await getWeeklyWinner(user.id);
            if (winner) {
                setIsWin(winner);
                if (winner.place === 1) {
                    setType('nft');
                } else {
                    setType('whitelist');
                }
            }
            setUserList(userList?.filter((user: any) => user.id !== winner?.userId) || []);
            setLoading(false)
        })()
    }, [])

    const calculateTimeLeft = () => {
        const targetTime = new Date('2024-01-30T13:00:00Z').getTime();
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference <= 0) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return {
            hours: hours < 10 ? `0${hours}` : hours,
            minutes: minutes < 10 ? `0${minutes}` : minutes,
            seconds: seconds < 10 ? `0${seconds}` : seconds
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // return (
    //     <SafeAreaView
    //         style={{ flex: 1 }}
    //     >
    //         <LinearGradient
    //             colors={['rgba(79, 255, 75, 0.8)', '#000']}
    //             locations={[0, 0.8]}
    //         >
    //             <ScrollView
    //                 style={{
    //                     paddingHorizontal: 16,
    //                     paddingBottom: 80,
    //                     height: Dimensions.get('screen').height
    //                 }}
    //             >
    //                 <View
    //                     style={{
    //                         display: 'flex',
    //                         flexDirection: 'row',
    //                         paddingVertical: 28,
    //                         columnGap: 12
    //                     }}>
    //                     <View
    //                         style={{
    //                             backgroundColor: 'linear-gradient(to bottom, #3CFF38, #FFC329)',
    //                             borderRadius: 12,
    //                             width: 100,
    //                             height: 100,
    //                             padding: 1,
    //                             display: 'flex',
    //                             flexDirection: 'row',
    //                             justifyContent: 'center',
    //                             alignItems: 'center'
    //                         }}>
    //                         <Image
    //                             source={{ uri: user.profileImage }}
    //                             style={{
    //                                 borderRadius: 12,
    //                                 width: 96,
    //                                 height: 96,
    //                                 backgroundColor: 'cyan',
    //                                 objectFit: 'cover'
    //                             }}
    //                         />
    //                     </View>
    //                     <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
    //                         <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
    //                             <Text style={{ fontFamily: 'Handjet', fontSize: 20, color: 'white', lineHeight: 24 }}>You have</Text>
    //                             <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
    //                                 <Image source={require('../assets/images/token.png')} style={{ width: 24, height: 24 }} />
    //                                 <Text style={{ fontFamily: 'Handjet', fontSize: 32, color: 'white', lineHeight: 40, fontWeight: 'bold' }}>{user.point || 0}</Text>
    //                             </View>
    //                             <TouchableOpacity onPress={() => setIsOpen(true)}>
    //                                 <Text style={{ fontFamily: 'Handjet', fontSize: 16, color: 'white', lineHeight: 24, textDecorationLine: 'underline' }}>Learn more</Text>
    //                             </TouchableOpacity>
    //                         </View>
    //                         {isWin && !isWin.walletAddress && !isWin.discordId && (
    //                             <TouchableOpacity style={{ alignSelf: 'flex-end', alignItems: 'center' }} onPress={() => setIsOpen(true)}>
    //                                 <Text style={{ fontFamily: 'Handjet', fontSize: 16, color: 'white', lineHeight: 24, textAlign: 'center', marginBottom: 8 }}>Open it</Text>
    //                                 <Image source={require('../assets/images/treasury.svg')} style={{ width: 56, height: 38 }} />
    //                             </TouchableOpacity>
    //                         )}
    //                     </View>
    //                 </View>

    //                 <TouchableHighlight
    //                     style={{
    //                         marginTop: 24,
    //                         backgroundColor: '#2C2C2C',
    //                         borderRadius: 20,
    //                         paddingHorizontal: 12,
    //                         paddingVertical: 8,
    //                         width: user.address ? 112 : 306
    //                     }}
    //                     onPress={async () => {
    //                         if (!user.address) {
    //                             await connectWallet();
    //                         }
    //                     }}
    //                 >
    //                     {!user.address ?
    //                         <Text
    //                             style={{
    //                                 fontWeight: '600',
    //                                 fontSize: 16,
    //                                 lineHeight: 16,
    //                                 letterSpacing: -0.08,
    //                                 color: 'white'
    //                             }}>
    //                             Connect wallet to enable NFT checkin
    //                         </Text>
    //                         :
    //                         <View>
    //                             <Text
    //                                 style={{
    //                                     fontWeight: '600',
    //                                     fontSize: 16,
    //                                     lineHeight: 16,
    //                                     letterSpacing: -0.08,
    //                                     color: 'white'
    //                                 }}
    //                             >
    //                                 {user.address.slice(0, 2)}...
    //                                 {user.address.slice(-6, -1)}
    //                             </Text>
    //                         </View>
    //                     }
    //                 </TouchableHighlight>

    //                 <View style={{ marginTop: 24, backgroundColor: '#2C2C2C', borderRadius: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, columnGap: 16 }}>
    //                     <TouchableOpacity style={{ flex: 1, display: 'flex', backgroundColor: '#9DFF50', borderRadius: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 }} onPress={() => router.replace('/drop/upload-image')}>
    //                         <FontAwesomeIcon icon={faPlusCircle} size={16} />
    //                         <Text style={{ fontFamily: 'Handjet', fontSize: 16, color: '#000000B2', fontWeight: 'bold', lineHeight: 24 }}>Add a spot</Text>
    //                         <View style={{ position: 'absolute', top: -16, backgroundColor: '#E2FFCA', borderRadius: 4, borderWidth: 1, borderColor: '#62C316', paddingVertical: 4, paddingHorizontal: 8 }}>
    //                             <Text style={{ fontFamily: 'Handjet', fontSize: 13, color: '#000000B2', fontWeight: 'bold', lineHeight: 18, textAlign: 'center' }}>+200</Text>
    //                         </View>
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={{ flex: 1, display: 'flex', backgroundColor: '#9DFF50', borderRadius: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 }} onPress={() => router.replace('/check-in/nearby')}>
    //                         <FontAwesomeIcon icon={faMapPin} size={16} />
    //                         <Text style={{ fontFamily: 'Handjet', fontSize: 16, color: '#000000B2', fontWeight: 'bold', lineHeight: 24 }}>Checkin</Text>
    //                         <View style={{ position: 'absolute', top: -16, backgroundColor: '#E2FFCA', borderRadius: 4, borderWidth: 1, borderColor: '#62C316', paddingVertical: 4, paddingHorizontal: 8 }}>
    //                             <Text style={{ fontFamily: 'Handjet', fontSize: 13, color: '#000000B2', fontWeight: 'bold', lineHeight: 18, textAlign: 'center' }}>+100</Text>
    //                         </View>
    //                     </TouchableOpacity>
    //                 </View>
    //                 {isWin &&
    //                     <>
    //                         <View style={{ marginTop: 24, height: 8, borderRadius: 4, backgroundColor: '#F5F5F51A' }} />
    //                         <View style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#2C2C2C', borderRadius: 20 }}>
    //                             <Text style={{ marginBottom: 4, color: 'white', fontWeight: 'bold', fontSize: 20, lineHeight: 32, fontFamily: 'Handjet' }}>Reward already received!</Text>
    //                             <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, lineHeight: 26, fontFamily: 'Handjet' }}>
    //                                 You've received this challenge's reward and can't participate further. But don't worry, your points still count for more benefits in the Trekn ecosystem. Keep exploring!
    //                             </Text>
    //                         </View>
    //                     </>
    //                 }
    //                 <View style={{ marginVertical: 24, height: 8, borderRadius: 4, backgroundColor: '#F5F5F51A' }} />
    //                 {loading ?
    //                     <LoadingSpinner />
    //                     :
    //                     <View style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#2C2C2C', borderRadius: 20 }}>
    //                         <Text style={{ fontFamily: 'Handjet', fontSize: 24, color: 'white', fontWeight: 'bold', lineHeight: 32, marginBottom: 24 }}>
    //                             This week Leaderboard
    //                         </Text>
    //                         <View style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
    //                             {
    //                                 userList.map((item, idx) =>
    //                                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} key={idx}>
    //                                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
    //                                             {idx < 3 ?
    //                                                 <Image
    //                                                     source={(): any => {
    //                                                         switch (idx) {
    //                                                             case 1:
    //                                                                 return require('../assets/images/1st.svg');
    //                                                             default:
    //                                                                 return require('../assets/images/1st.svg');
    //                                                         }
    //                                                         return require('../assets/images/1st.svg');
    //                                                     }}
    //                                                     style={{ width: 40, height: 40 }}
    //                                                 />
    //                                                 :
    //                                                 <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: '#606060' }}>
    //                                                     <Text style={{ fontFamily: 'Handjet', color: 'white', fontSize: 13, fontWeight: 'bold', lineHeight: 13 }}>{idx + 1}</Text>
    //                                                 </View>
    //                                             }
    //                                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
    //                                                 <Image source={{ uri: item.profileImage }} style={{ width: 48, height: 48, borderRadius: 24 }} />
    //                                                 <Text style={{ fontFamily: 'Handjet', color: 'white', fontSize: 20, fontWeight: 'bold', lineHeight: 25 }}>{item.name}</Text>
    //                                             </View>
    //                                         </View>
    //                                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
    //                                             <Image source={require('../assets/images/token.png')} style={{ width: 25, height: 25 }} />
    //                                             <Text style={{ fontFamily: 'Handjet', color: 'white', fontSize: 20, lineHeight: 25 }}>{item.weeklyPoint}</Text>
    //                                         </View>
    //                                     </View>
    //                                 )
    //                             }
    //                         </View>
    //                     </View>
    //                 }
    //                 {/* {isWin && type &&
    //             <Drawer
    //                 placement='bottom'
    //                 closable={false}
    //                 open={isOpen}
    //                 onClose={handleClose}
    //                 height={currentView === 'success' ? windowSize.height * 0.4 : windowSize.height * 0.9}
    //                 className='rounded-t-3xl'
    //                 style={{ background: '#2C2C2C' }}
    //             >
    //                 <div className="flex flex-col h-full">
    //                     <div className="flex flex-row justify-end">
    //                         <div onClick={handleClose}>
    //                             <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
    //                                 <g filter="url(#filter0_b_3234_15933)">
    //                                     <rect width="30" height="30" rx="15" fill="#545454" />
    //                                     <path d="M10.0474 19.1811C9.73633 19.4921 9.72998 20.0444 10.0537 20.3681C10.3838 20.6918 10.936 20.6855 11.2407 20.3808L14.9985 16.623L18.75 20.3745C19.0674 20.6918 19.6133 20.6918 19.937 20.3681C20.2607 20.038 20.2607 19.4985 19.9434 19.1811L16.1919 15.4296L19.9434 11.6718C20.2607 11.3544 20.2671 10.8085 19.937 10.4848C19.6133 10.1611 19.0674 10.1611 18.75 10.4785L14.9985 14.2299L11.2407 10.4785C10.936 10.1674 10.3774 10.1547 10.0537 10.4848C9.72998 10.8085 9.73633 11.3671 10.0474 11.6718L13.7988 15.4296L10.0474 19.1811Z" fill="white" />
    //                                 </g>
    //                                 <defs>
    //                                     <filter id="filter0_b_3234_15933" x="-54.3656" y="-54.3656" width="138.731" height="138.731" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    //                                         <feFlood flood-opacity="0" result="BackgroundImageFix" />
    //                                         <feGaussianBlur in="BackgroundImageFix" stdDeviation="27.1828" />
    //                                         <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3234_15933" />
    //                                         <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_3234_15933" result="shape" />
    //                                     </filter>
    //                                 </defs>
    //                             </svg>
    //                         </div>
    //                     </div>
    //                     {currentView === 'success' ?
    //                         <>
    //                             <img src='/reward-close.png' className='w-16 h-16 mb-2' alt='' />
    //                             <div>
    //                                 <p className='font-bold text-2xl leading-[40px] text-white'>Collect successful</p>
    //                                 <p className='text-[#FFFFFFB2] leading-[140%]'>{body[type].done}</p>
    //                             </div>
    //                             <div
    //                                 className="w-full h-10 bg-black rounded-3xl mt-auto flex flex-row items-center justify-center"
    //                                 onClick={handleClose}
    //                             >
    //                                 <p className='text-white leading-6 font-semibold'>Done</p>
    //                             </div>
    //                         </>
    //                         :
    //                         <>
    //                             <div className="mb-5">
    //                                 <p className='font-bold text-2xl leading-[40px] text-white'>{body[type].header}</p>
    //                                 <p className='text-[#FFFFFFB2] leading-[140%]'>{body[type].desc}</p>
    //                             </div>
    //                             {currentView === 'award' &&
    //                                 <>
    //                                     <img src={body[type].img} alt='' className='h-[339px] rounded-xl object-cover object-center' />
    //                                     <div
    //                                         className="w-full h-10 bg-black rounded-3xl mt-auto flex flex-row items-center justify-center"
    //                                         onClick={() => setCurrentView('claim')}
    //                                     >
    //                                         <p className='text-white leading-6 font-semibold'>Collect this</p>
    //                                     </div>
    //                                 </>
    //                             }
    //                             {currentView === 'claim' &&
    //                                 <>
    //                                     <div className="mt-5">
    //                                         <div className="py-2 px-3 bg-[#3A3A3A] flex flex-row items-center gap-x-2 w-fit rounded-xl">
    //                                             <img src='/solana.png' alt='' className='w-6 h-6' />
    //                                             <p className='text-[13px] leading-[120%] text-white'>Network: Solana</p>
    //                                         </div>
    //                                         <div className="mt-6">
    //                                             <p className='text-[13px] text-[#BDBDBA] leading-[120%]'>Enter the recipent wallet address</p>
    //                                         </div>
    //                                         <input
    //                                             onChange={(e) => { setWallet(e.currentTarget.value) }}
    //                                             type="text"
    //                                             value={wallet}
    //                                             placeholder='Wallet address'
    //                                             className='py-4 px-3 w-full focus-visible:outline-none text-white placeholder:text-[#FFFFFF80] text-base font-medium leading-[120%] bg-[#212121DE] mt-6 rounded-xl'
    //                                         />
    //                                         <input
    //                                             onChange={(e) => { setDiscordId(e.currentTarget.value) }}
    //                                             type="text"
    //                                             value={discordId}
    //                                             placeholder='Discord Id'
    //                                             className=' mt-2 py-4 px-3 w-full focus-visible:outline-none text-white placeholder:text-[#FFFFFF80] text-base font-medium leading-[120%] bg-[#212121DE] mt-6 rounded-xl'
    //                                         />
    //                                     </div>
    //                                     <div
    //                                         className={`w-full h-10 bg-black rounded-3xl mt-auto flex flex-row items-center justify-center ${!wallet || !discordId && 'select-none bg-gray-400'}`}
    //                                         onClick={handleConfirm}
    //                                     >
    //                                         <p className='text-white leading-6 font-semibold'>Confirm</p>
    //                                     </div>
    //                                 </>
    //                             }
    //                         </>
    //                     }
    //                 </div>
    //             </Drawer>
    //         } */}
    //                 {/* <div
    //     className="fixed bg-[#3a3a3ab3] top-0 left-0 right-0 bottom-0"
    //     style={{ background: 'linear-gradient(14deg, #212121 14.53%, rgba(140, 255, 50, 0.28) 80.23%), #4E4E4E' }}
    //   >
    //     <div
    //       className="flex flex-col items-center justify-center"
    //       style={{ height: 'calc(100vh - 81px)' }}
    //     >
    //       <p
    //         style={{ fontFamily: 'Handjet' }}
    //         className='text-[60px] leading-[60px] text-white tracking-[-0.301px] mb-3'
    //       >
    //         {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
    //       </p>
    //       <img src='/treasury.svg' alt='' className='w-[210px] h-[140px]' />
    //     </div>
    //   </div> */}
    //             </ScrollView>
    //         </LinearGradient>
    //     </SafeAreaView>
    // )
    return (
        <SafeAreaView style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text>Updating</Text>
        </SafeAreaView>
    )
}
