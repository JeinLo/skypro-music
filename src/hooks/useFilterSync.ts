'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setFilters, setSearchTrack, resetFilters } from '@/store/features/trackSlice';

export function useFilterSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { filters, searchTrack } = useAppSelector((state) => state.tracks);

  // Синхронизация URL → Redux (при загрузке)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const author = params.getAll('author');
    const genre = params.getAll('genre');
    const sort = params.get('sort') || 'По умолчанию';
    const q = params.get('q') || '';

    dispatch(setFilters({
      author,
      genre,
      sortByYear: sort,
    }));
    dispatch(setSearchTrack(q));
  }, [searchParams, dispatch]);

  // Синхронизация Redux → URL
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    filters.author.forEach(a => params.append('author', a));
    filters.genre.forEach(g => params.append('genre', g));
    if (filters.sortByYear !== 'По умолчанию') {
      params.set('sort', filters.sortByYear);
    }
    if (searchTrack) {
      params.set('q', searchTrack);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, searchTrack, pathname, router]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  const reset = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return { reset };
}