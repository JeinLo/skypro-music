'use client';

import { useState } from 'react';
import classNames from 'classnames';
import styles from './Filter.module.css';
import { data } from '@/data';
import { getUniqueValuesByKey } from '@/utils/helper';
import FilterItem from '../FilterItem/FilterItem';

type FilterName = 'author' | 'year' | 'genre';

export default function Filter() {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  const authors = getUniqueValuesByKey(data, 'author').filter((author) => author !== '-');
  const genres = getUniqueValuesByKey(data, 'genre');
  const years = ['По умолчанию', 'Сначала новые', 'Сначала старые'];

  const toggleFilter = (filter: FilterName) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
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
        </div>
        {activeFilter === 'author' && (
          <div className={styles.filter__list}>
            {authors.map((author) => (
              <FilterItem key={author} value={author} />
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
              <FilterItem key={year} value={year} />
            ))}
          </div>
        )}
      </div>
      <div className={styles.filter__button_wrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === 'year',
          })}
          onClick={() => toggleFilter('genre')}
        >
          жанру
        </div>
        {activeFilter === 'genre' && (
          <div className={styles.filter__list}>
            {genres.map((genre) => (
              <FilterItem key={genre} value={genre} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}