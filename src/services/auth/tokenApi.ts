import axios from 'axios';
import { BASE_URL } from '../constants';

export const getTokens = async (email: string, password: string) => {
  const res = await axios.post(`${BASE_URL}/user/token/`, { email, password }, {
    headers: { 'content-type': 'application/json' },
  });
  return res.data;
};

export const refreshToken = async (refresh: string) => {
  const res = await axios.post(`${BASE_URL}/user/token/refresh/`, { refresh }, {
    headers: { 'content-type': 'application/json' },
  });
  return res.data;
};