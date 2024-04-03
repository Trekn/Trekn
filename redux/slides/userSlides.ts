import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { now } from 'moment';

let initialState: any = {
  id: 0,
  name: '',
  email: '',
  address: '',
  profileImage: '',
  description: '',
  point: 0,
  lat: 0,
  lng: 0,
  following: 0,
  follower: 0,
  country: null,
  city: null,
  lastFetch: -1,
};

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    checkUser: (state, action) => {
      return (state = { ...state, ...action.payload });
    },
    updateUser: (state, action) => {
      const { name, email, address, profileImage, point, id, description } =
        action.payload;
      state.id = id ? id : state.id;
      state.name = name ? name : state.name;
      state.email = email ? email : state.email;
      state.address = address || address === '' ? address : state.address;
      state.profileImage = profileImage ? profileImage : state.profileImage;
      state.point = point ? point : state.point;
      state.description = description ? description : state.description;
      state.lastFetch = now();
      AsyncStorage.setItem('user', JSON.stringify(state));
    },
    updateCoordinate: (state, action) => {
      const { lat, lng } = action.payload;
      state.lat = lat ? lat : state.lat;
      state.lng = lng ? lng : state.lng;

      return state;
      // AsyncStorage.setItem("user", JSON.stringify(state)); // Update AsyncStorage
    },
    resetUser: (state) => {
      state.id = 0;
      state.name = '';
      state.email = '';
      state.address = '';
      state.profileImage = '';
      state.point = 0;
      state.description = '';
      (async () => {
        await AsyncStorage.removeItem('user');
      })();
    },
    updateInit: (state, action) => {
      const { country, following, follower, city } = action.payload;
      if (following) {
        state.following = following;
      }
      if (follower) {
        state.follower = follower;
      }
      if (country) {
        state.country = country;
      }
      if (city) {
        state.city = city;
      }
    },
  },
});

export const {
  updateUser,
  resetUser,
  updateCoordinate,
  updateInit,
  checkUser,
} = userSlide.actions;

export default userSlide.reducer;
