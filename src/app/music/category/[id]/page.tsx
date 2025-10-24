'use client';

import { Suspense, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from '../../main/page.module.css';
import Bar from '@/components/Bar/Bar';
import Sidebar from '@/components/Sidebar/Sidebar';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import { getPlaylistTracks } from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppDispatch } from '@/store/store';
import { setPlaylist } from '@/store/features/trackSlice';

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const dispatch = useAppDispatch();
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { id } = await params;
        const fetchedTracks = await getPlaylistTracks(id); // ← response уже TrackType[]
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
  }, [params, dispatch]);

  if (loading) {
    return <p style={{ padding: '40px', textAlign: 'center' }}>Загрузка подборки...</p>;
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
        <footer className="footer"></footer>
      </div>
    </div>
  );
}