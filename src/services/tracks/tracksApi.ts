import axios from 'axios';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { BASE_URL } from '@/services/constants';

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