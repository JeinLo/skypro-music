'use client';

import classNames from 'classnames';
import styles from './Title.module.css';

export default function Title() {
  return (
    <div className={styles.content__title}>
      <div className={classNames(styles.playlistTitle__col, styles.col01)}>
        Трек
      </div>
      <div className={classNames(styles.playlistTitle__col, styles.col02)}>
        Исполнитель
      </div>
      <div className={classNames(styles.playlistTitle__col, styles.col03)}>
        Альбом
      </div>
      <div className={classNames(styles.playlistTitle__col, styles.col04)}>
        <svg className={styles.playlistTitle__svg}>
          <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
        </svg>
      </div>
    </div>
  );
}