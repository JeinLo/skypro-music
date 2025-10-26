import { refreshToken } from '@/services/auth/authApi';
import { setAccessToken } from '@/store/features/authSlice';
import { AppDispatch } from '@/store/store';
import { AxiosError } from 'axios';

export const withReauth = async <T>(
  apiCall: () => Promise<T>,
  refresh: string,
  dispatch: AppDispatch
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      try {
        const { access } = await refreshToken(refresh);
        dispatch(setAccessToken(access));
        return await apiCall();
      } catch (refreshError) {
        throw new Error('Не удалось обновить токен. Пожалуйста, войдите снова.');
      }
    }
    throw error;
  }
};