'use client'

import Image from "next/image";
import Link from "next/link";
import classnames from 'classnames'

import styles from './page.module.css'
import Bar from "@/components/Bar/Bar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Centerblock from "@/components/Centerblock/Centerblock";
import Navigation from "@/components/Navigation/Navigation";
import { useEffect, useState } from "react";
import { getTracks } from "@/services/tracks/tracksApi";
import { TrackType } from "@/sharedTypes/sharedTypes";
import { error } from "console";

export default function Home() {
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTracks().then((res) => {
      setTracks(res);
      alert('res');
    })
    .catch((error) => {
      if (error instanceof AxiosError){
            if (error.response) {
      setError(error.response.data);
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
      // http.ClientRequest в node.js
      console.log(error.request);
      setError('Что-то с интернетом');
    } else {
      // Произошло что-то при настройке запроса, вызвавшее ошибку
      console.log('Error', error.message);
      setError('Неизвестная ошибка');
    }
      }
    })
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          {error}
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