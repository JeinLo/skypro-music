import { useEffect } from 'react';
import { useAppDispatch } from '@/store/store';
import { setAuth } from '@/store/features/authSlice';

export const useInitAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (access && refresh && userId && username) {
      dispatch(
        setAuth({
          access,
          refresh,
          userId: parseInt(userId, 10),
          username,
        })
      );
    }
  }, [dispatch]);
};