import { Suspense } from 'react';
import classNames from 'classnames';
import styles from './page.module.css';
import Bar from '@/components/Bar/Bar';
import Sidebar from '@/components/Sidebar/Sidebar';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import { getTracks } from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';

export default async function Home() {
  let tracks: TrackType[] = [];
  try {
    tracks = await getTracks();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Неизвестная ошибка');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Suspense fallback={<p>Загрузка треков...</p>}>
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