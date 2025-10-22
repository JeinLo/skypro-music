import { TrackType } from '@/sharedTypes/sharedTypes';
import { BASE_URL } from '../constants';

// Получение всех треков
export const getTracks = async (): Promise<TrackType[]> => {
  const res = await fetch(`${BASE_URL}/catalog/track/all/`, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error('Ошибка при получении треков');
  }
  const json = await res.json();
  return json.data;
};

// Получение подборки по ID
export const getPlaylistTracks = async (id: string): Promise<TrackType[]> => {
  const res = await fetch(`${BASE_URL}/catalog/selection/${id}/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Ошибка при получении подборки ${id}`);
  }

  const json = await res.json();
  const trackIds: number[] = json.data.items; // ← массив ID

  // Получаем все треки и фильтруем по ID
  const allTracks = await getTracks();
  return allTracks.filter((track) => trackIds.includes(track._id));
};