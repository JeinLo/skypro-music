'use client';

import { useFilteredTracks } from '@/hooks/useFilteredTracks';
import Search from '../Search/Search';
import Filter from '../Filter/Filter';
import Title from '../Title/Title';
import Track from '../Track/Track';
import { TrackType } from '@/sharedTypes/sharedTypes';
import styles from './Centerblock.module.css';

type CenterblockProps = {
  tracks: TrackType[];
  isLoading?: boolean;
  errorMessage?: string;
  title?: string;
  pagePlaylist?: TrackType[];
};

export default function Centerblock({
  tracks: sourceTracks,
  isLoading,
  errorMessage,
  title,
  pagePlaylist = sourceTracks,
}: CenterblockProps) {
  const filteredTracks = useFilteredTracks(sourceTracks);

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{title || 'Треки'}</h2>
      {errorMessage && <div className={styles.error__message}>{errorMessage}</div>}
      {isLoading ? (
        <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>
          Загрузка...
        </div>
      ) : (
        <>
          <Filter />
          <div className={styles.centerblock__content}>
            <Title />
            <div className={styles.content__playlist}>
              {filteredTracks.length > 0 ? (
                filteredTracks.map((track) => (
                  <Track key={track._id} track={track} playlist={pagePlaylist} />
                ))
              ) : (
                <div style={{ color: '#fff', textAlign: 'center', padding: '20px' }}>
                  Треки не найдены
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}