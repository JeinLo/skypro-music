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
  const { allTracks } = useAppSelector((state) => state.tracks);
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  const authors = getUniqueValuesByKey(allTracks.length > 0 ? allTracks : data, 'author').filter(
    (author) => author !== '-'
  );
  const genres = getUniqueValuesByKey(allTracks.length > 0 ? allTracks : data, 'genre');
  const years = ['По умолчанию', 'Сначала новые', 'Сначала старые'];

  const toggleFilter = useCallback((filter: FilterName) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  }, []);

  const handleFilterSelect = useCallback(
    (filterType: FilterName, value: string) => {
      dispatch(setFilters({ filterType, value }));
      setActiveFilter(null);
    },
    [dispatch]
  );

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
        </div>
        {activeFilter === 'author' && (
          <div className={styles.filter__list}>
            {authors.map((author) => (
              <FilterItem
                key={author}
                value={author}
                onSelect={() => handleFilterSelect('author', author)}
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
        </div>
        {activeFilter === 'year' && (
          <div className={styles.filter__list}>
            {years.map((year) => (
              <FilterItem
                key={year}
                value={year}
                onSelect={() => handleFilterSelect('year', year)}
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
        </div>
        {activeFilter === 'genre' && (
          <div className={styles.filter__list}>
            {genres.map((genre) => (
              <FilterItem
                key={genre}
                value={genre}
                onSelect={() => handleFilterSelect('genre', genre)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}