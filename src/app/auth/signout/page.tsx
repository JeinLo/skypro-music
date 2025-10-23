'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/auth/authApi';
import { useAppDispatch } from '@/store/store';
import { logout } from '@/store/features/authSlice';
import { clearAllTracks } from '@/store/features/trackSlice';

export default function SignOut() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    logoutUser();
    dispatch(logout());
    dispatch(clearAllTracks());
    router.push('/auth/signin');
  }, [dispatch, router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
      Выход...
    </div>
  );
}