'use client';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from './page.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { getTracks } from '@/services/tracks/tracksApi';
import { setAllTracks, setTitlePlaylist, setErrorMessage, setCollectionTracks } from '@/store/features/trackSlice';
import { AxiosError } from 'axios';
import { usePathname } from 'next/navigation';

export default function Home() {
  const dispatch = useAppDispatch();
  const patchName = usePathname();
  console.log(patchName)
  const { allTracks, filters, searchTrack } = useAppSelector((state) => state.tracks);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessageLocal] = useState('');

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const res = await getTracks();
        dispatch(setAllTracks(res));
        dispatch(setCollectionTracks([]));
        dispatch(setTitlePlaylist('Треки'));
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            setErrorMessageLocal(error.response.data.message || 'Ошибка загрузки треков');
            dispatch(setErrorMessage(error.response.data.message || 'Ошибка загрузки треков'));
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
    fetchTracks();
    if (patchName === "music/main") {
      fetchTracks()
    }
  }, [dispatch, patchName]);

  const playlist = useMemo(() => {
    let result = allTracks;
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
  }, [allTracks, filters, searchTrack]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock
            isLoading={isLoading}
            tracks={playlist}
            title="Треки"
            errorMessage={errorMessage}
            pagePlaylist={allTracks}
          />
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}