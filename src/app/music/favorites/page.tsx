import { Suspense } from 'react';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from '../main/page.module.css';
import { getFavorites } from '@/services/tracks/favoriteApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function getAccessToken() {
  const cookieStore = cookies();
  const access = (await cookieStore).get('access')?.value;
  if (!access) redirect('/auth/signin');
  return access;
}

export default async function FavoritesPage() {
  let tracks: TrackType[] = [];
  try {
    const access = await getAccessToken();
    tracks = await getFavorites(access);
  } catch (error) {
    console.error('Ошибка загрузки избранного:', error);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Suspense fallback={<p style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</p>}>
            {/* УБРАЛИ title */}
            <Centerblock tracks={tracks} />
          </Suspense>
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}