'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from '../main/page.module.css';
import { useAppSelector } from '@/store/store';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useMemo } from 'react';
import { data } from '@/data';

export default function MyPlaylistPage() {
  const favoriteTrackIds = useAppSelector((state) => state.tracks.favoriteTrackIds);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = typeof window !== 'undefined' ? parseInt(localStorage.getItem('userId') || '0', 10) : 0;

  const favoriteTracks: TrackType[] = useMemo(() => {
    return data.filter((track) =>
      favoriteTrackIds.includes(track._id) ||
      (track.starred_user && Array.isArray(track.starred_user) && track.starred_user.includes(userId))
    );
  }, [favoriteTrackIds, userId]);

  if (!isAuthenticated) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <main className={styles.main}>
            <Navigation />
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              Войдите в аккаунт, чтобы увидеть "Мой плейлист"
            </div>
            <Sidebar />
          </main>
          <Bar />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock tracks={favoriteTracks} />
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}