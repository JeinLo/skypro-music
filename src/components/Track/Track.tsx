'use client';

import Link from 'next/link';
import classNames from 'classnames';
import styles from './Track.module.css';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { formatTime } from '@/utils/helper';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCurrentTrack } from '@/store/features/trackSlice';

type TrackProps = {
  track: TrackType;
  playlist: TrackType[];
};

export default function Track({ track, playlist }: TrackProps) {
  const dispatch = useAppDispatch();
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);

  const isCurrentTrack = currentTrack?._id === track._id;

  const onClickCurrentTrack = () => {
    dispatch(setCurrentTrack({ track, playlist }));
  };

  return (
    <div
      className={styles.playlist__item}
      onClick={onClickCurrentTrack}
    >
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
          <svg className={styles.track__timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}