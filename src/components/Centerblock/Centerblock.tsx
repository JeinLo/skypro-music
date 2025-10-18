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
};

export default function Centerblock({ tracks }: CenterblockProps) {
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const playlist = useAppSelector((state) => state.tracks.playlist);
  const shufflePlaylist = useAppSelector((state) => state.tracks.shufflePlaylist);
  const displayPlaylist = isShuffle ? shufflePlaylist : (playlist.length > 0 ? playlist : tracks);

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <Filter />
      <div className={styles.centerblock__content}>
        <Title />
        <div className={styles.content__playlist}>
          {displayPlaylist.map((track) => (
            <Track key={track._id} track={track} playlist={displayPlaylist} />
          ))}
        </div>
      </div>
    </div>
  );
}