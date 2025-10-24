'use client';

import Link from 'next/link';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Bar.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setIsPlay, setNextTrack, setPrevTrack, toggleShuffle } from '@/store/features/trackSlice';
import ProgressBar from '../ProgressBar/ProgressBar';
import { getTimePanel } from '@/utils/helper';
import { useLikeTrack } from '@/hooks/useLikeTrack';

export default function Bar() {
  const { currentTrack, isPlay, isShuffle } = useAppSelector((state) => state.tracks);
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { isLike, toggleLike, isLoading: likeLoading } = useLikeTrack(currentTrack);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.track_file;
      audioRef.current.volume = volume;
      audioRef.current.loop = isLoop;
      setIsLoadedTrack(false);
      setCurrentTime(0);

      const handleLoadedMetadata = () => {
        setIsLoadedTrack(true);
        setDuration(audioRef.current!.duration || 0);
        if (isPlay) audioRef.current!.play().catch(() => {});
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current!.currentTime);
      };

      const handleEnded = () => {
        if (!isLoop) dispatch(setNextTrack());
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);

      audioRef.current.load();

      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrack, isLoop, volume, dispatch]);

  useEffect(() => {
    if (audioRef.current && isLoadedTrack) {
      if (isPlay) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlay, isLoadedTrack]);

  const togglePlay = () => dispatch(setIsPlay(!isPlay));
  const onToggleLoop = () => setIsLoop(!isLoop);
  const onToggleShuffle = () => dispatch(toggleShuffle());
  const onNextTrack = () => dispatch(setNextTrack());
  const onPrevTrack = () => dispatch(setPrevTrack());

  const onChangeProgress = (e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = Number(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} />
      <div className={styles.bar__content}>
        <div className={styles.timePanel}>{getTimePanel(currentTime, duration)}</div>
        <ProgressBar
          max={duration}
          step={0.1}
          disabled={!isLoadedTrack}
          value={currentTime}
          onChange={onChangeProgress}
        />
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={classNames(styles.player__btnPrev, styles.btnIcon)} onClick={onPrevTrack}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div className={classNames(styles.player__btnPlay, styles.btn)} onClick={togglePlay}>
                <svg className={styles.player__btnPlaySvg}>
                  <use xlinkHref={`/img/icon/sprite.svg#icon-${isPlay ? 'pause' : 'play'}`}></use>
                </svg>
              </div>
              <div className={classNames(styles.player__btnNext, styles.btnIcon)} onClick={onNextTrack}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnRepeat, styles.btnIcon, { [styles.active]: isLoop })}
                onClick={onToggleLoop}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={classNames(styles.player__btnShuffle, styles.btnIcon, { [styles.active]: isShuffle })}
                onClick={onToggleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.album}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__likeDis}>
                <div
                  className={classNames(styles.trackPlay__like, styles.btnIcon, {
                    [styles.loading]: likeLoading,
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike();
                  }}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref={`/img/icon/sprite.svg#icon-${isLike ? 'dislike' : 'like'}`} />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classNames(styles.volume__progress, styles.btn)}>
                <input
                  className={styles.volume__progressLine}
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => {
                    const v = Number(e.target.value) / 100;
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}