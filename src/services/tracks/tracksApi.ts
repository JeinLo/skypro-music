import { TrackType } from '@/sharedTypes/sharedTypes';
import { BASE_URL } from '../constants';

export const getTracks = async (): Promise<TrackType[]> => {
  const res = await fetch(`${BASE_URL}/catalog/track/all/`, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error('Ошибка при получении треков');
  }
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
};

export const getPlaylistTracks = async (id: string): Promise<{ items: TrackType[] }> => {
  const res = await fetch(`${BASE_URL}/catalog/selection/${id}/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Ошибка при получении подборки ${id}`);
  }
  const data = await res.json();
  return { items: Array.isArray(data.items) ? data.items : [] };
};