'use client';
import Link from 'next/link';
import { ChangeEvent, useEffect, useRef, useState, useCallback } from 'react';
import classNames from 'classnames';
import styles from './Bar.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setIsPlay, setNextTrack, setPrevTrack, toggleShuffle } from '@/store/features/trackSlice';
import ProgressBar from '../ProgressBar/ProgressBar';
import { getTimePanel } from '@/utils/helper';
import { useLikeTrack } from '@/hooks/useLikeTrack';

export default function Bar() {
  const tracksState = useAppSelector((state) => state.tracks);
  const currentTrack = tracksState?.currentTrack;
  const isPlay = tracksState?.isPlay ?? false;
  const isShuffle = tracksState?.isShuffle ?? false;
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { isLoading: isLikeLoading, errorMsg: likeError, toggleLike, isLike } = useLikeTrack(currentTrack);

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
        if (isPlay) {
          audioRef.current!.play().catch((error) => {
            console.error('Ошибка воспроизведения:', error);
          });
        }
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current!.currentTime);
      };

      const handleEnded = () => {
        if (!isLoop) {
          dispatch(setNextTrack());
        }
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
  }, [currentTrack, isLoop, dispatch]);

  useEffect(() => {
    if (audioRef.current && isLoadedTrack) {
      if (isPlay) {
        audioRef.current.play().catch((error) => {
          console.error('Ошибка воспроизведения:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlay, isLoadedTrack]);

  const togglePlay = useCallback(() => {
    dispatch(setIsPlay(!isPlay));
  }, [dispatch, isPlay]);

  const onToggleLoop = useCallback(() => {
    setIsLoop(!isLoop);
  }, [isLoop]);

  const onToggleShuffle = useCallback(() => {
    dispatch(toggleShuffle());
  }, [dispatch]);

  const onNextTrack = useCallback(() => {
    dispatch(setNextTrack());
  }, [dispatch]);

  const onPrevTrack = useCallback(() => {
    dispatch(setPrevTrack());
  }, [dispatch]);

  const onChangeProgress = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const inputTime = Number(e.target.value);
      audioRef.current.currentTime = inputTime;
      setCurrentTime(inputTime);
    }
  }, []);

  if (!currentTrack) return null;

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} src={currentTrack.track_file} />
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
                  <use xlinkHref={`/img/icon/sprite.svg#icon-${isPlay ? 'pause' : 'play'}`} />
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
                    [styles.active]: isLike,
                    [styles.loading]: isLikeLoading,
                  })}
                  onClick={toggleLike}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref={`/img/icon/sprite.svg#icon-${isLike ? 'like-filled' : 'like'}`} />
                  </svg>
                </div>
                {likeError && <div className={styles.errorContainer}>{likeError}</div>}
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
                  className={classNames(styles.volume__progressLine, styles.btn)}
                  type="range"
                  name="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => {
                    const newVolume = Number(e.target.value) / 100;
                    setVolume(newVolume);
                    if (audioRef.current) {
                      audioRef.current.volume = newVolume;
                    }
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