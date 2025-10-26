'use client';
import styles from './Centerblock.module.css';
import Search from '../Search/Search';
import Filter from '../Filter/Filter';
import Title from '../Title/Title';
import Track from '../Track/Track';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppSelector } from '@/store/store';

type CenterblockProps = {
  tracks: TrackType[];
  isLoading?: boolean;
  errorMessage?: string;
  title?: string;
  pagePlaylist?: TrackType[];
};

export default function Centerblock({ tracks, isLoading, errorMessage, title, pagePlaylist = tracks }: CenterblockProps) {
  const tracksState = useAppSelector((state) => state.tracks);
  const isShuffle = tracksState?.isShuffle ?? false;
  const playlist = tracksState?.playlist ?? [];
  const shufflePlaylist = tracksState?.shufflePlaylist ?? [];
  const displayPlaylist = isShuffle ? shufflePlaylist : (playlist.length > 0 ? playlist : tracks);

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
              {displayPlaylist.map((track) => (
                <Track key={track._id} track={track} playlist={pagePlaylist} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}