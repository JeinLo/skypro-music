'use client';
import Centerblock from '@/components/Centerblock/Centerblock';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { getFavoriteTracks } from '@/services/tracks/tracksApi';
import { setFavoriteTracks, setPlaylist, setTitlePlaylist, setErrorMessage, setCollectionTracks } from '@/store/features/trackSlice';

export default function PlaylistPage() {
  const dispatch = useAppDispatch();
  const { favoriteTracks, filters, searchTrack } = useAppSelector((state) => state.tracks);
  const { access } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessageLocal] = useState('');

  useEffect(() => {
    if (!access) {
      setErrorMessageLocal('Пожалуйста, войдите в аккаунт');
      dispatch(setErrorMessage('Пожалуйста, войдите в аккаунт'));
      setIsLoading(false);
      return;
    }

    const fetchFavoriteTracks = async () => {
      setIsLoading(true);
      try {
        const tracks = await getFavoriteTracks(access);
        dispatch(setFavoriteTracks(tracks));
        dispatch(setPlaylist(tracks));
        dispatch(setCollectionTracks([]));
        dispatch(setTitlePlaylist('Мой плейлист'));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Ошибка загрузки избранных треков';
        setErrorMessageLocal(message);
        dispatch(setErrorMessage(message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteTracks();
  }, [dispatch, access]);

  const playlist = useMemo(() => {
    let result = favoriteTracks;

    if (filters.author.length) {
      result = result.filter((track) => filters.author.includes(track.author));
    }
    if (filters.genre.length) {
      result = result.filter((track) =>
        track.genre.some((genre) => filters.genre.includes(genre))
      );
    }
    if (searchTrack) {
      result = result.filter(
        (track) =>
          track.name.toLowerCase().includes(searchTrack.toLowerCase()) ||
          track.author.toLowerCase().includes(searchTrack.toLowerCase())
      );
    }
    if (filters.sortByYear !== 'По умолчанию') {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        return filters.sortByYear === 'Сначала новые' ? dateB - dateA : dateA - dateB;
      });
    }
    return result;
  }, [favoriteTracks, filters, searchTrack]);

  return (
    <Centerblock
      isLoading={isLoading}
      tracks={playlist}
      title="Мой плейлист"
      errorMessage={errorMessage}
      pagePlaylist={favoriteTracks}
    />
  );
}