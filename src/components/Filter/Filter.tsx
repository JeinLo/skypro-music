'use client';

import { useState, useCallback } from 'react';
import classNames from 'classnames';
import styles from './Filter.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setFilters } from '@/store/features/trackSlice';
import FilterItem from '../FilterItem/FilterItem';
import { getUniqueValuesByKey } from '@/utils/helper';
import { data } from '@/data';

type FilterName = 'author' | 'year' | 'genre';

export default function Filter() {
  const dispatch = useAppDispatch();
  const { allTracks, filters } = useAppSelector((state) => state.tracks);
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  const tracks = allTracks.length > 0 ? allTracks : data;

  const rawAuthors = getUniqueValuesByKey(tracks, 'author');
  const authors = [
    ...rawAuthors.filter(a => a !== '-' && a !== ''),
    ...(rawAuthors.includes('-') || rawAuthors.includes('') ? ['-'] : [])
  ];

  const genres = getUniqueValuesByKey(tracks, 'genre');
  const years = ['По умолчанию', 'Сначала новые', 'Сначала старые'];

  const toggleFilter = useCallback((filter: FilterName) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  }, []);

  const handleAuthorToggle = (author: string) => {
    const newAuthors = filters.author.includes(author)
      ? filters.author.filter(a => a !== author)
      : [...filters.author, author];
    dispatch(setFilters({ ...filters, author: newAuthors }));
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genre.includes(genre)
      ? filters.genre.filter(g => g !== genre)
      : [...filters.genre, genre];
    dispatch(setFilters({ ...filters, genre: newGenres }));
  };

  const handleYearSelect = (year: string) => {
    dispatch(setFilters({ ...filters, sortByYear: year }));
    setActiveFilter(null);
  };

  const getSelectedCount = (type: FilterName): number => {
    switch (type) {
      case 'author': return filters.author.length;
      case 'genre': return filters.genre.length;
      case 'year': return filters.sortByYear !== 'По умолчанию' ? 1 : 0;
      default: return 0;
    }
  };

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>

      <div className={styles.filter__button_wrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === 'author',
          })}
          onClick={() => toggleFilter('author')}
        >
          исполнителю
          {getSelectedCount('author') > 0 && (
            <span className={styles.selectedBadge}>{getSelectedCount('author')}</span>
          )}
        </div>
        {activeFilter === 'author' && (
          <div className={styles.filter__list}>
            {authors.map(author => (
              <FilterItem
                key={author}
                value={author === '-' ? 'Неизвестный' : author}
                isSelected={filters.author.includes(author)}
                onSelect={() => handleAuthorToggle(author)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.filter__button_wrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === 'year',
          })}
          onClick={() => toggleFilter('year')}
        >
          году выпуска
          {getSelectedCount('year') > 0 && (
            <span className={styles.selectedBadge}>1</span>
          )}
        </div>
        {activeFilter === 'year' && (
          <div className={styles.filter__list}>
            {years.map(year => (
              <FilterItem
                key={year}
                value={year}
                isSelected={filters.sortByYear === year}
                onSelect={() => handleYearSelect(year)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.filter__button_wrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === 'genre',
          })}
          onClick={() => toggleFilter('genre')}
        >
          жанру
          {getSelectedCount('genre') > 0 && (
            <span className={styles.selectedBadge}>{getSelectedCount('genre')}</span>
          )}
        </div>
        {activeFilter === 'genre' && (
          <div className={styles.filter__list}>
            {genres.map(genre => (
              <FilterItem
                key={genre}
                value={genre}
                isSelected={filters.genre.includes(genre)}
                onSelect={() => handleGenreToggle(genre)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}