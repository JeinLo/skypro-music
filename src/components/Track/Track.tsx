'use client';

import Link from 'next/link';
import classNames from 'classnames';
import styles from './Track.module.css';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { formatTime } from '@/utils/helper';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCurrentTrack } from '@/store/features/trackSlice';
import { addFavoriteTrack, removeFavoriteTrack } from '@/services/tracks/tracksApi';
import { useState } from 'react';

type TrackProps = {
  track: TrackType;
  playlist: TrackType[];
};

export default function Track({ track, playlist }: TrackProps) {
  const dispatch = useAppDispatch();
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const userId = localStorage.getItem('userId'); // Предполагаем, что _id пользователя сохранён
  const [isFavorite, setIsFavorite] = useState(
    !!track.starred_user?.includes(Number(userId)),
  );

  const isCurrentTrack = currentTrack?._id === track._id;

  const onClickCurrentTrack = () => {
    dispatch(setCurrentTrack({ track, playlist }));
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteTrack(track._id);
        setIsFavorite(false);
      } else {
        await addFavoriteTrack(track._id);
        setIsFavorite(true);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка при изменении избранного');
    }
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
              e.stopPropagation(); // Предотвращаем запуск трека при клике на лайк
              toggleFavorite();
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