import styles from './Centerblock.module.css';
import Search from '../Search/Search';
import Filter from '../Filter/Filter';
import Title from '../Title/Title';
import Track from '../Track/Track';
import { data } from '@/data';

export default function Centerblock() {
  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <Filter />
      <div className={styles.centerblock__content}>
        <Title />
        <div className={styles.content__playlist}>
          {data.map((track) => (
            <Track key={track._id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
}