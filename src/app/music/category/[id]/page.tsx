import { Suspense } from 'react';
import classNames from 'classnames';
import styles from '../main/page.module.css';
import Bar from '@/components/Bar/Bar';
import Sidebar from '@/components/Sidebar/Sidebar';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import { getPlaylistTracks } from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';

type CategoryPageProps = {
  params: { id: string };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  let tracks: TrackType[] = [];
  try {
    tracks = await getPlaylistTracks(params.id);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Неизвестная ошибка');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Suspense fallback={<p>Загрузка подборки...</p>}>
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