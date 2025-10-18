import { TrackType } from '@/sharedTypes/sharedTypes';
import { BASE_URL } from '../constants';

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

export const getFavoriteTracks = async (): Promise<TrackType[]> => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Требуется авторизация');
  }
  const res = await fetch(`${BASE_URL}/catalog/track/favorite/all/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store', // Избранное может часто меняться
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Токен недействителен или просрочен');
    }
    throw new Error('Ошибка при получении избранных треков');
  }
  const data = await res.json();
  return data;
};

export const addFavoriteTrack = async (trackId: number): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Требуется авторизация');
  }
  const res = await fetch(`${BASE_URL}/catalog/track/${trackId}/favorite/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Токен недействителен или просрочен');
    }
    throw new Error('Ошибка при добавлении трека в избранное');
  }
};

export const removeFavoriteTrack = async (trackId: number): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Требуется авторизация');
  }
  const res = await fetch(`${BASE_URL}/catalog/track/${trackId}/favorite/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Токен недействителен или просрочен');
    }
    throw new Error('Ошибка при удалении трека из избранного');
  }
};