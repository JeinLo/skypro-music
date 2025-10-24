import { useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { addLikedTracks, removeLikedTracks } from '@/store/features/trackSlice';
import { withReauth } from '@/utils/withReauth';
import { addLike, removeLike } from '@/services/tracks/favoriteApi';
import { TrackType } from '@/sharedTypes/sharedTypes';

type ReturnType = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleLike: () => void;
  isLike: boolean;
};

export const useLikeTrack = (track: TrackType | null): ReturnType => {
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const userId = typeof window !== 'undefined' ? parseInt(localStorage.getItem('userId') || '0', 10) : 0;

  const isLike = track 
    ? (track.starred_user && Array.isArray(track.starred_user) 
        ? track.starred_user.includes(userId) 
        : false) || favoriteTracks.some((t) => t._id === track._id)
    : false;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLike = useCallback(() => {
    if (!access || !track) {
      setErrorMsg('Нет авторизации или трек не выбран');
      return;
    }

    const currentLiked = track.starred_user && Array.isArray(track.starred_user) 
      ? track.starred_user.includes(userId) 
      : false;
    const actionApi = currentLiked ? removeLike : addLike;
    const actionSlice = currentLiked ? removeLikedTracks : addLikedTracks;

    setIsLoading(true);
    setErrorMsg(null);

    withReauth(
      (newToken) => actionApi(newToken || access, track._id),
      refresh!,
      dispatch,
    )
      .then(() => {
        track.starred_user = track.starred_user && Array.isArray(track.starred_user)
          ? currentLiked
            ? track.starred_user.filter(id => id !== userId)
            : [...track.starred_user, userId]
          : currentLiked ? [] : [userId];
        dispatch(actionSlice(track));
      })
      .catch((error) => {
        setErrorMsg(error instanceof Error ? error.message : 'Неизвестная ошибка');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [access, refresh, track, userId, dispatch]);

  return { isLoading, errorMsg, toggleLike, isLike };
};