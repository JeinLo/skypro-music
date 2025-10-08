import Image from "next/image";
import Link from "next/link";
import classnames from 'classnames'

import styles from './page.module.css'
import Bar from "@/components/Bar/Bar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Centerblock from "@/components/Centerblock/Centerblock";
import Navigation from "@/components/Navigation/Navigation";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock />
          <Sidebar />
        </main>
          <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}