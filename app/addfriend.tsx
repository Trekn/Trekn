import AddFriendList from '@/components/friend/AddFriendList'
import Header from '@/components/home/Header'
import React from 'react'
import { SafeAreaView } from 'react-native'

export default function Addfriend() {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
    >
      <Header />
      <AddFriendList/>
    </SafeAreaView>
  )
}
