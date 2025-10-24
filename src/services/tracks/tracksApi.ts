import { TrackType } from '@/sharedTypes/sharedTypes';
import { BASE_URL } from '../constants';

// Получение всех треков
export const getTracks = async (): Promise<TrackType[]> => {
  const res = await fetch(`${BASE_URL}/catalog/track/all/`, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error('Ошибка при получении треков');
  }
  const data = await res.json();
  return data.data;
};

export const getPlaylistTracks = async (id: string): Promise<TrackType[]> => {
  const res = await fetch(`${BASE_URL}/catalog/selection/${id}/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Ошибка при получении подборки ${id}`);
  }
  const data = await res.json();
  return data.items;
};