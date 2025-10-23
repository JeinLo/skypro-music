// src/services/auth/authApi.ts
import axios from 'axios';
import { BASE_URL } from '../constants';

export type AuthUserProps = {
  email: string;
  password: string;
};

export type AuthUserReturn = {
  email: string;
  username: string;
  _id: number;
};

/**
 * Логин через /user/login/ — сохраняет username и userId в localStorage
 */
export const authUser = async (data: AuthUserProps): Promise<AuthUserReturn> => {
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
      throw new Error(error.response.data.message || 'Ошибка авторизации');
    }
    throw new Error('Нет интернета');
  }
};

/**
 * Выход — только очистка localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
};