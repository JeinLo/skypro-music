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

type SignupResponse = {
  message: string;
  result: {
    username: string;
    email: string;
    _id: number;
  };
  success: boolean;
};

export const authUser = async (data: AuthUserProps): Promise<AuthUserReturn> => {
  try {
    const res = await axios.post<AuthUserReturn>(`${BASE_URL}/user/login/`, data, {
      headers: {
        'content-type': 'application/json',
      },
    });
    const userData = res.data;
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userId', String(userData._id));
    return userData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 401) {
        throw new Error(data.message || 'Ошибка авторизации');
      }
      throw new Error('Сервер недоступен, попробуйте позже');
    }
    throw new Error('Отсутствует интернет, попробуйте позже');
  }
};

export const signupUser = async (
  data: AuthUserProps & { username: string },
): Promise<AuthUserReturn> => {
  try {
    const res = await axios.post<SignupResponse>(`${BASE_URL}/user/signup/`, data, {
      headers: {
        'content-type': 'application/json',
      },
    });
    const { result } = res.data;
    localStorage.setItem('username', result.username);
    localStorage.setItem('userId', String(result._id));
    return result;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 403) {
        throw new Error(data.message || 'Введенный Email уже занят');
      }
      throw new Error('Сервер недоступен, попробуйте позже');
    }
    throw new Error('Отсутствует интернет, попробуйте позже');
  }
};

export const logoutUser = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
};