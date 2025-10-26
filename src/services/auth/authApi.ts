import axios from 'axios';
import { BASE_URL } from '@/services/constants';
import { createUserProp } from './types';

export const createUser = ({ email, password }: createUserProp) => {
  const data = {
    email,
    password,
    username: email,
  };
  console.log('Signup URL:', `${BASE_URL}/user/signup/`, 'Data:', data);
  return axios({
    method: 'post',
    url: `${BASE_URL}/user/signup/`,
    headers: {
      'content-type': 'application/json',
    },
    data,
  });
};

export const loginUser = (data: createUserProp) => {
  console.log('Login URL:', `${BASE_URL}/user/login/`, 'Data:', data);
  return axios({
    method: 'post',
    url: `${BASE_URL}/user/login/`,
    data,
  });
};

export const logoutUser = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('favoriteTrackIds');
};

type accessTokenType = {
  access: string;
};

type refreshTokenType = {
  refresh: string;
};

type tokensType = accessTokenType & refreshTokenType;

export const getTokens = (data: createUserProp): Promise<tokensType> => {
  console.log('Token URL:', `${BASE_URL}/user/token/`, 'Data:', data);
  return axios.post(`${BASE_URL}/user/token/`, data).then((res) => res.data);
};

export const refreshToken = (refresh: string): Promise<accessTokenType> => {
  console.log('Refresh Token URL:', `${BASE_URL}/user/token/refresh/`, 'Data:', { refresh });
  return axios.post(`${BASE_URL}/user/token/refresh/`, { refresh }).then((res) => res.data);
};