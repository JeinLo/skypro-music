'use client';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from '../../main/page.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { getPlaylistTracks } from '@/services/tracks/tracksApi';
import { setCollectionTracks, setTitlePlaylist, setErrorMessage } from '@/store/features/trackSlice';
import { useParams } from 'next/navigation';
import { AxiosError } from 'axios';

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const { collectionTracks, filters, searchTrack } = useAppSelector(
    (state) => state.tracks
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessageLocal] = useState('');

  useEffect(() => {
    const fetchSelectionTracks = async () => {
      setIsLoading(true);
      try {
        const res = await getPlaylistTracks(params.id);
        dispatch(setCollectionTracks(res)); // res уже TrackType[]
        dispatch(setTitlePlaylist(`Подборка ${params.id}`));
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            setErrorMessageLocal(error.response.data.message || 'Ошибка загрузки подборки');
            dispatch(setErrorMessage(error.response.data.message || 'Ошибка загрузки подборки'));
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
    fetchSelectionTracks();
  }, [dispatch, params.id]);

  const playlist = useMemo(() => {
    let result = collectionTracks;
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
  }, [collectionTracks, filters, searchTrack]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock
            isLoading={isLoading}
            tracks={playlist}
            title={`Подборка ${params.id}`}
            errorMessage={errorMessage}
            pagePlaylist={collectionTracks}
          />
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}