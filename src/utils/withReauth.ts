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
        console.log('Attempting to refresh token with:', refresh);
        const { access } = await refreshToken(refresh);
        console.log('New access token:', access);
        dispatch(setAccessToken(access));
        localStorage.setItem('access', access);
        return await apiCall();
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        throw new Error('Не удалось обновить токен. Пожалуйста, войдите снова.');
      }
    }
    throw error;
  }
};