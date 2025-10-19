'use client';

import Link from 'next/link';
import classNames from 'classnames';
import styles from './Track.module.css';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { formatTime } from '@/utils/helper';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCurrentTrack, toggleFavorite } from '@/store/features/trackSlice';
import { useState, useEffect } from 'react';

type TrackProps = {
  track: TrackType;
  playlist: TrackType[];
};

export default function Track({ track, playlist }: TrackProps) {
  const dispatch = useAppDispatch();
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const favoriteTrackIds = useAppSelector((state) => state.tracks.favoriteTrackIds);
  const [isFavorite, setIsFavorite] = useState(favoriteTrackIds.includes(track._id));

  useEffect(() => {
    // Синхронизация favoriteTrackIds с localStorage
    const savedFavorites = localStorage.getItem('favoriteTrackIds');
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites) as number[];
      favoriteIds.forEach((id) => {
        if (!favoriteTrackIds.includes(id)) {
          dispatch(toggleFavorite(id));
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    // Сохранение favoriteTrackIds в localStorage
    localStorage.setItem('favoriteTrackIds', JSON.stringify(favoriteTrackIds));
    setIsFavorite(favoriteTrackIds.includes(track._id));
  }, [favoriteTrackIds, track._id]);

  const isCurrentTrack = currentTrack?._id === track._id;

  const onClickCurrentTrack = () => {
    dispatch(setCurrentTrack({ track, playlist }));
  };

  const toggleFavoriteTrack = () => {
    dispatch(toggleFavorite(track._id));
  };

  return (
    <div className={styles.playlist__item} onClick={onClickCurrentTrack}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            <svg className={styles.track__titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
            {isCurrentTrack && (
              <span
                className={classNames(styles.currentTrackDot, {
                  [styles.pulsating]: isPlay,
                })}
              />
            )}
          </div>
          <div className={styles.track__titleText}>
            <Link
              className={classNames(styles.track__titleLink, {
                [styles.activeTrack]: isCurrentTrack,
              })}
              href=""
            >
              {track.name} <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className={styles.track__time}>
          <svg
            className={classNames(styles.track__timeSvg, { [styles.active]: isFavorite })}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteTrack();
            }}
          >
            <use xlinkHref={`/img/icon/sprite.svg#icon-${isFavorite ? 'like-filled' : 'like'}`} />
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}