'use client';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './Track.module.css';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { formatTime } from '@/utils/helper';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCurrentTrack } from '@/store/features/trackSlice';
import { useLikeTrack } from '@/hooks/useLikeTrack';
import { useCallback } from 'react';

type TrackProps = {
  track: TrackType;
  playlist: TrackType[];
};

export default function Track({ track, playlist }: TrackProps) {
  const dispatch = useAppDispatch();
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const { isLoading: isLikeLoading, errorMsg: likeError, toggleLike, isLike } = useLikeTrack(track);

  const isCurrentTrack = currentTrack?._id === track._id;

  const onClickCurrentTrack = useCallback(() => {
    dispatch(setCurrentTrack({ track, playlist }));
  }, [dispatch, track, playlist]);

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
            className={classNames(styles.track__timeSvg, {
              [styles.active]: isLike,
              [styles.loading]: isLikeLoading,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          >
            <use xlinkHref={isLike ? '/img/icon/dislike.svg' : '/img/icon/sprite.svg#icon-like'} />
          </svg>
          {likeError && <div className={styles.errorContainer}>{likeError}</div>}
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}