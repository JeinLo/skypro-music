import axios from 'axios';
import { BASE_URL } from '@/services/constants';

export type AuthUserProps = {
  email: string;
  password: string;
};

export type AuthUserReturn = {
  email: string;
  username: string;
  _id: number;
};

export type TokenReturn = {
  access: string;
  refresh: string;
};

/**
 * Регистрация через /user/signup/
 */
export const createUser = async (data: AuthUserProps): Promise<AuthUserReturn> => {
  const payload = {
    email: data.email,
    password: data.password,
    username: data.email, // username равен email
  };
  console.log('Signup URL:', `${BASE_URL}/user/signup/`, 'Data:', payload);
  try {
    const res = await axios.post<AuthUserReturn>(`${BASE_URL}/user/signup/`, payload, {
      headers: { 'content-type': 'application/json' },
    });
    const userData = res.data;
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userId', String(userData._id));
    return userData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Ошибка регистрации');
    }
    throw new Error('Нет интернета');
  }
};

/**
 * Логин через /user/login/ — сохраняет username и userId в localStorage
 */
export const loginUser = async (data: AuthUserProps): Promise<AuthUserReturn> => {
  console.log('Login URL:', `${BASE_URL}/user/login/`, 'Data:', data);
  try {
    const res = await axios.post<AuthUserReturn>(`${BASE_URL}/user/login/`, data, {
      headers: { 'content-type': 'application/json' },
    });
    const userData = res.data;
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userId', String(userData._id));
    return userData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('Login error response:', error.response.data);
      throw new Error(error.response.data.message || 'Ошибка авторизации');
    }
    throw new Error('Нет интернета');
  }
};

/**
 * Получение токенов через /user/token/
 */
export const getTokens = async (email: string, password: string): Promise<TokenReturn> => {
  const data = { email, password };
  console.log('Token URL:', `${BASE_URL}/user/token/`, 'Data:', data);
  try {
    const res = await axios.post<TokenReturn>(`${BASE_URL}/user/token/`, data, {
      headers: { 'content-type': 'application/json' },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Ошибка получения токенов');
    }
    throw new Error('Нет интернета');
  }
};

/**
 * Обновление токена через /user/token/refresh/
 */
export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  console.log('Refresh Token URL:', `${BASE_URL}/user/token/refresh/`, 'Data:', { refresh });
  try {
    const res = await axios.post<{ access: string }>(`${BASE_URL}/user/token/refresh/`, { refresh }, {
      headers: { 'content-type': 'application/json' },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Ошибка обновления токена');
    }
    throw new Error('Нет интернета');
  }
};

/**
 * Выход — очистка localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('favoriteTrackIds');
};