import axios from 'axios';
import { PlaylistSelectionType, TrackType } from '@/sharedTypes/sharedTypes';
import { BASE_URL } from '@/services/constants';
import { getFavorites } from '@/services/tracks/favoriteApi';

export const getFavoriteTracks = async (access: string): Promise<TrackType[]> => {
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
  const res = await axios.get(`${BASE_URL}/catalog/track/all/`);
  return res.data.data;
};

export const getAllSelections = async (): Promise<PlaylistSelectionType[]> => {
  const res = await axios.get(`${BASE_URL}/catalog/selection/all`);
  return res.data.data;
};