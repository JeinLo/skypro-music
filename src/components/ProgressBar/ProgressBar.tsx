import styles from './ProgressBar.module.css';
import { ChangeEvent } from 'react';

type ProgressBarProp = {
  max: number;
  value: number;
  step: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
};

export default function ProgressBar({
  max,
  value,
  step,
  onChange,
  disabled,
}: ProgressBarProp) {
  return (
    <input
      className={styles.styledProgressInput}
      type="range"
      min="0"
      max={max}
      value={value}
      step={step}
      onChange={onChange}
      disabled={disabled}
    />
  );
}