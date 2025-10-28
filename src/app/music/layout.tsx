// src/app/music/layout.tsx

'use client';
import { ReactNode } from 'react';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from './main/page.module.css';
import { useInitAuth } from '@/hooks/useInitAuth';

export default function MusicLayout({ children }: { children: ReactNode }) {
  useInitAuth();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          {children}
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}