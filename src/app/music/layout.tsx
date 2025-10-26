'use client';
import { ReactNode } from 'react';
import styles from './main/page.module.css';
import { useAppDispatch } from '@/store/store';
import { useEffect } from 'react';
import { useInitAuth } from '@/hooks/useInitAuth';

export default function MusicLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  useInitAuth();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}