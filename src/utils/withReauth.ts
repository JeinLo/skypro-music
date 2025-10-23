import { AxiosError } from 'axios';
import { refreshToken } from '@/services/auth/tokenApi';
import { AppDispatch } from '@/store/store';
import { setAccessToken } from '@/store/features/authSlice';

export const withReauth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refresh: string,
  dispatch: AppDispatch,
): Promise<T> => {
  try {
    return await apiFunction('');
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      try {
        const newTokens = await refreshToken(refresh);
        dispatch(setAccessToken(newTokens.access));
        return await apiFunction(newTokens.access);
      } catch (refreshError) {
        throw refreshError;
      }
    }
    throw error;
  }
};