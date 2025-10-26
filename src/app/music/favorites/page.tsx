'use client';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from '../main/page.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { getFavorites } from '@/services/tracks/favoriteApi';
import { setFavoriteTracks, setTitlePlaylist, setErrorMessage } from '@/store/features/trackSlice';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { withReauth } from '@/utils/withReauth';
import { TrackType } from '@/sharedTypes/sharedTypes';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { access, refresh, isAuthenticated } = useAppSelector((state) => state.auth);
  const { favoriteTracks, filters, searchTrack } = useAppSelector(
    (state) => state.tracks
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessageLocal] = useState('');

  // Проверяем авторизацию
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, router]);

  // Загружаем избранные треки
  useEffect(() => {
    if (isAuthenticated && access && refresh) {
      setIsLoading(true);
      const fetchFavoriteTracks = async () => {
        try {
          const res = await withReauth(() => getFavorites(access), refresh, dispatch);
          dispatch(setFavoriteTracks(res.data)); // Извлекаем res.data
          dispatch(setTitlePlaylist('Мой плейлист'));
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) {
              setErrorMessageLocal(error.response.data.message || 'Ошибка загрузки избранного');
              dispatch(setErrorMessage(error.response.data.message || 'Ошибка загрузки избранного'));
            } else if (error.request) {
              setErrorMessageLocal('Похоже, что-то с интернет-соединением... Попробуйте позже');
              dispatch(setErrorMessage('Похоже, что-то с интернет-соединением... Попробуйте позже'));
            } else {
              setErrorMessageLocal('Неизвестная ошибка. Попробуйте перезагрузить страницу');
              dispatch(setErrorMessage('Неизвестная ошибка. Попробуйте перезагрузить страницу'));
            }
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchFavoriteTracks();
    } else if (isAuthenticated) {
      setErrorMessageLocal('Пожалуйста, войдите в аккаунт заново');
      router.push('/auth/signin');
    }
  }, [dispatch, access, refresh, isAuthenticated, router]);

  // Оптимизация списка треков
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

  if (!isAuthenticated) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <main className={styles.main}>
            <Navigation />
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
              Войдите в аккаунт, чтобы увидеть "Мой плейлист"
            </div>
            <Sidebar />
          </main>
          <Bar />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock
            tracks={playlist}
            isLoading={isLoading}
            errorMessage={errorMessage}
            title="Мой плейлист"
            pagePlaylist={favoriteTracks}
          />
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}