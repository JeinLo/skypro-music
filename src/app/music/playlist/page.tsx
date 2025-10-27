'use client';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from '../main/page.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { getFavoriteTracks } from '@/services/tracks/tracksApi';
import { setFavoriteTracks, setTitlePlaylist, setErrorMessage } from '@/store/features/trackSlice';

export default function PlaylistPage() {
  const dispatch = useAppDispatch();
  const { favoriteTracks, filters, searchTrack } = useAppSelector((state) => state.tracks);
  const { access } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessageLocal] = useState('');

  useEffect(() => {
    if (!access) {
      setErrorMessageLocal('Пожалуйста, войдите в аккаунт');
      dispatch(setErrorMessage('Пожалуйста, войдите в аккаунт'));
      return;
    }

    const fetchFavoriteTracks = async () => {
      setIsLoading(true);
      try {
        const tracks = await getFavoriteTracks(access);
        dispatch(setFavoriteTracks(tracks));
        dispatch(setTitlePlaylist('Мой плейлист'));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessageLocal(error.message || 'Ошибка загрузки избранных треков');
          dispatch(setErrorMessage(error.message || 'Ошибка загрузки избранных треков'));
        } else {
          setErrorMessageLocal('Неизвестная ошибка. Попробуйте перезагрузить страницу');
          dispatch(setErrorMessage('Неизвестная ошибка. Попробуйте перезагрузить страницу'));
        }
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
      result = result.filter((track) => track.genre.some((genre) => filters.genre.includes(genre)));
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
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock
            isLoading={isLoading}
            tracks={playlist}
            title="Мой плейлист"
            errorMessage={errorMessage}
            pagePlaylist={favoriteTracks}
          />
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}