import axios from 'axios';

const request = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND,
  headers: { 'Content-Type': 'application/json' },
});

export default request;
