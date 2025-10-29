'use client';

import { useState, useEffect } from 'react';
import styles from './Search.module.css';
import { useAppDispatch } from '@/store/store';
import { setSearchTrack } from '@/store/features/trackSlice';
import { useDebounce } from '@/hooks/useDebounce';

export default function Search() {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch(setSearchTrack(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  );
}