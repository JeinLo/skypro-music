import axios from 'axios';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { BASE_URL } from '@/services/constants';
import { getFavorites } from '@/services/tracks/favoriteApi';

export const getFavoriteTracks = async (access: string): Promise<TrackType[]> => {
  console.log('Get Favorite Tracks URL:', `${BASE_URL}/catalog/track/favorite/all/`);
  try {
    const res = await getFavorites(access);
    return res.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Ошибка загрузки избранных треков');
    }
    throw new Error('Нет интернета');
  }
};

export const getTracks = async (): Promise<TrackType[]> => {
  console.log('Get Tracks URL:', `${BASE_URL}/catalog/track/all/`);
  const res = await axios.get(`${BASE_URL}/catalog/track/all/`);
  return res.data.data;
};

export const getPlaylistTracks = async (id: string): Promise<number[]> => {
  console.log('Get Playlist Tracks URL:', `${BASE_URL}/catalog/selection/${id}/`);
  const res = await axios.get(`${BASE_URL}/catalog/selection/${id}/`);
  return res.data.items;
};