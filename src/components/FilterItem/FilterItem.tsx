'use client';
import styles from './FilterItem.module.css';
import classNames from 'classnames';

type FilterItemProps = {
  value: string;
  onSelect: () => void;
  isSelected?: boolean;
};

export default function FilterItem({ value, onSelect, isSelected }: FilterItemProps) {
  return (
    <div
      className={classNames(styles.filter__item, {
        [styles.selected]: isSelected,
      })}
      onClick={onSelect}
    >
      {value}
    </div>
  );
}