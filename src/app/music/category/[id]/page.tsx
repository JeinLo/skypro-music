'use client';
import Centerblock from '@/components/Centerblock/Centerblock';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from '../../main/page.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { getPlaylistTracks, getTracks } from '@/services/tracks/tracksApi';
import { setCollectionTracks, setTitlePlaylist, setErrorMessage, setPlaylist } from '@/store/features/trackSlice';
import { useParams } from 'next/navigation';
import { TrackType } from '@/sharedTypes/sharedTypes';

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const { collectionTracks, filters, searchTrack, titlePlaylist } = useAppSelector(
    (state) => state.tracks
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessageLocal] = useState('');
  const [localTitle, setLocalTitle] = useState('Подборка');

  useEffect(() => {
    const fetchSelectionTracks = async () => {
      setIsLoading(true);
      try {
        const trackIds = await getPlaylistTracks(params.id);
        const allTracks = await getTracks();
        const tracks = allTracks.filter((track) => trackIds.includes(track._id));
        dispatch(setCollectionTracks(tracks));
        dispatch(setPlaylist(tracks));
        const playlistTitles: { [key: string]: string } = {
          '2': 'Плейлист дня',
          '3': '100 танцевальных хитов',
          '4': 'Инди-заряд',
        };
        const newTitle = playlistTitles[params.id] || 'Подборка';
        setLocalTitle(newTitle);
        dispatch(setTitlePlaylist(newTitle));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessageLocal(error.message || 'Ошибка загрузки подборки');
          dispatch(setErrorMessage(error.message || 'Ошибка загрузки подборки'));
        } else {
          setErrorMessageLocal('Неизвестная ошибка. Попробуйте перезагрузить страницу');
          dispatch(setErrorMessage('Неизвестная ошибка. Попробуйте перезагрузить страницу'));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchSelectionTracks();
  }, [dispatch, params.id]);

  const playlist = useMemo(() => {
    let result = collectionTracks;
    console.log('Filters:', filters);
    if (filters && Array.isArray(filters.author) && filters.author.length > 0) {
      result = result.filter((track) => filters.author.includes(track.author));
    }
    if (filters && Array.isArray(filters.genre) && filters.genre.length > 0) {
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
    if (filters && filters.sortByYear !== 'По умолчанию') {
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
            title={localTitle}
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