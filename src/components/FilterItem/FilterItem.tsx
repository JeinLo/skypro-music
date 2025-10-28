'use client';
import styles from './FilterItem.module.css';

type FilterItemProps = {
  value: string;
  onSelect: () => void;
};

export default function FilterItem({ value, onSelect }: FilterItemProps) {
  return (
    <div className={styles.filter__item} onClick={onSelect}>
      {value}
    </div>
  );
}