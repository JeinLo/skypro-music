import axios from 'axios';
import { BASE_URL } from '../constants';

interface TokenResponse {
  access: string;
  refresh: string;
}

export const getTokens = async (email: string, password: string): Promise<TokenResponse> => {
  try {
    const res = await axios.post(`${BASE_URL}/user/token/`, { email, password }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data as TokenResponse;
  } catch (error) {
    throw new Error('Ошибка получения токенов: неверные учетные данные');
  }
};

export const refreshToken = async (refresh: string): Promise<TokenResponse> => {
  try {
    const res = await axios.post(`${BASE_URL}/user/token/refresh/`, { refresh }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data as TokenResponse;
  } catch (error) {
    throw new Error('Ошибка обновления токена');
  }
};