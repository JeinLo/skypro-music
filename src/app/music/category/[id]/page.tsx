'use client';
import Centerblock from '@/components/Centerblock/Centerblock';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useMemo, useState } from 'react';
import { getTracks, getAllSelections } from '@/services/tracks/tracksApi';
import { setCollectionTracks, setPlaylist, setTitlePlaylist, setErrorMessage } from '@/store/features/trackSlice';
import { useParams } from 'next/navigation';
import { TrackType, PlaylistSelectionType } from '@/sharedTypes/sharedTypes';

export default function CategoryPage() {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const { collectionTracks, filters, searchTrack } = useAppSelector((state) => state.tracks);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessageLocal] = useState('');
  const [selection, setSelection] = useState<PlaylistSelectionType | null>(null);

  useEffect(() => {
    const fetchSelection = async () => {
      setIsLoading(true);
      try {
        const selections: PlaylistSelectionType[] = await getAllSelections();
        const currentSelection = selections.find(s => s._id === Number(params.id));
        if (!currentSelection) throw new Error('Подборка не найдена');

        const allTracks: TrackType[] = await getTracks();
        const selectionTracks = allTracks.filter(track => 
          currentSelection.items.includes(track._id)
        );

        dispatch(setCollectionTracks(selectionTracks));
        dispatch(setPlaylist(selectionTracks));
        dispatch(setTitlePlaylist(currentSelection.name));
        setSelection(currentSelection);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Ошибка загрузки подборки';
        setErrorMessageLocal(message);
        dispatch(setErrorMessage(message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSelection();
  }, [dispatch, params.id]);

  const playlist = useMemo(() => {
    let result = collectionTracks;
    if (filters && Array.isArray(filters.author) && filters.author.length > 0) {
      result = result.filter(track => filters.author.includes(track.author));
    }
    if (filters && Array.isArray(filters.genre) && filters.genre.length > 0) {
      result = result.filter(track =>
        track.genre.some(genre => filters.genre.includes(genre))
      );
    }
    if (searchTrack) {
      result = result.filter(track =>
        track.name.toLowerCase().includes(searchTrack.toLowerCase()) ||
        track.author.toLowerCase().includes(searchTrack.toLowerCase())
      );
    }
    if (filters && filters.sortByYear && filters.sortByYear !== 'По умолчанию') {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        return filters.sortByYear === 'Сначала новые' ? dateB - dateA : dateA - dateB;
      });
    }
    return result;
  }, [collectionTracks, filters, searchTrack]);

  return (
    <Centerblock
      isLoading={isLoading}
      tracks={playlist}
      title={selection?.name || 'Загрузка...'}
      errorMessage={errorMessage}
      pagePlaylist={collectionTracks}
    />
  );
}