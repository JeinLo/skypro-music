import { useMemo } from 'react';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppSelector } from '@/store/store';

export function useFilteredTracks(sourceTracks: TrackType[]) {
  const { filters, searchTrack } = useAppSelector((state) => state.tracks);

  return useMemo(() => {
    let result = [...sourceTracks];

    // Поиск
    if (searchTrack) {
      const q = searchTrack.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q)
      );
    }

    // Автор
    if (filters.author.length > 0) {
      result = result.filter(t => filters.author.includes(t.author));
    }

    // Жанр
    if (filters.genre.length > 0) {
      result = result.filter(t =>
        t.genre.some(g => filters.genre.includes(g))
      );
    }

    // Год
    if (filters.sortByYear !== 'По умолчанию') {
      result.sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        return filters.sortByYear === 'Сначала новые' ? dateB - dateA : dateA - dateB;
      });
    }

    return result;
  }, [sourceTracks, filters, searchTrack]);
}