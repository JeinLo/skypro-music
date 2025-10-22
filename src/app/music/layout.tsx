import { ReactNode } from 'react';
import styles from './main/page.module.css';

export default function MusicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}