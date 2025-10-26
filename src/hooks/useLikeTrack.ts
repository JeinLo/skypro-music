import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useState, useCallback } from 'react';
import { withReauth } from '@/utils/withReauth';
import { AxiosError } from 'axios';
import { addLikedTracks, removeLikedTracks } from '@/store/features/trackSlice';
import { addLike, removeLike } from '@/services/tracks/favoriteApi';

type returnTypeHook = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleLike: () => void;
  isLike: boolean;
};

export const useLikeTrack = (track: TrackType | null): returnTypeHook => {
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const isLike = track ? favoriteTracks.some((t) => t._id === track._id) : false;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLike = useCallback(() => {
    if (!access || !refresh) {
      setErrorMsg('Пожалуйста, войдите в аккаунт');
      return;
    }

    if (!track) {
      setErrorMsg('Трек не выбран');
      return;
    }

    const actionApi = isLike ? removeLike : addLike;
    const actionSlice = isLike ? removeLikedTracks : addLikedTracks;

    setIsLoading(true);
    setErrorMsg(null);

    withReauth(
      () => actionApi(access, track._id),
      refresh,
      dispatch
    )
      .then(() => {
        dispatch(actionSlice(track));
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setErrorMsg(error.response.data.message || 'Ошибка сервера');
          } else if (error.request) {
            setErrorMsg('Похоже, что-то с интернет-соединением. Попробуйте позже');
          } else {
            setErrorMsg('Неизвестная ошибка');
          }
        } else {
          setErrorMsg('Неизвестная ошибка');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [access, refresh, track, isLike, dispatch]);

  return {
    isLoading,
    errorMsg,
    toggleLike,
    isLike,
  };
};