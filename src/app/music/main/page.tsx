'use client';

import { useEffect, useState } from 'react';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from './page.module.css';
import { getTracks } from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppDispatch } from '@/store/store';
import { setPlaylist } from '@/store/features/trackSlice';

export default function MainPage() {
  const dispatch = useAppDispatch();
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const fetchedTracks = await getTracks();
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

    fetchTracks();
  }, [dispatch]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock tracks={tracks} />
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}