'use client';

import styles from './FilterItem.module.css';

type FilterItemProps = {
  value: string;
};

export default function FilterItem({ value }: FilterItemProps) {
  return <div className={styles.filter__item}>{value}</div>;
}