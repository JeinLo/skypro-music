'use client';

import { Suspense, useEffect, useState } from 'react';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from '../main/page.module.css';
import { getFavorites } from '@/services/tracks/favoriteApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import { setPlaylist } from '@/store/features/trackSlice';

export default function FavoritesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const access = typeof window !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('access='))?.split('=')[1] : undefined;
        if (!access) {
          router.push('/auth/signin');
          return;
        }

        const fetchedTracks = await getFavorites(access);
        const userId = typeof window !== 'undefined' ? parseInt(localStorage.getItem('userId') || '0', 10) : 0;
        const updatedTracks = fetchedTracks.map((track: TrackType) => ({
          ...track,
          isLiked: track.starred_user && Array.isArray(track.starred_user) ? track.starred_user.includes(userId) : false,
        }));

        setTracks(updatedTracks);
        dispatch(setPlaylist(updatedTracks));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router, dispatch]);

  if (loading) {
    return <p style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</p>;
  }

  if (error) {
    return <p style={{ padding: '40px', textAlign: 'center' }}>{error}</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Suspense fallback={<p style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</p>}>
            <Centerblock tracks={tracks} />
          </Suspense>
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}