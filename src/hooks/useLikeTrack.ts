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

  const isLike = favoriteTracks.some((t) => t._id === track?._id);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLike = useCallback(() => {
    if (!access || !track) {
      setErrorMsg('Нет авторизации');
      return;
    }

    const actionApi = isLike ? removeLike : addLike;
    const actionSlice = isLike ? removeLikedTracks : addLikedTracks;

    setIsLoading(true);
    setErrorMsg(null);

    withReauth(
      (newToken) => actionApi(newToken || access, track._id),
      refresh!,
      dispatch,
    )
      .then(() => {
        dispatch(actionSlice(track));
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg('Неизвестная ошибка');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [access, refresh, track, isLike, dispatch]);

  return { isLoading, errorMsg, toggleLike, isLike };
};