import axios from 'axios';
import { BASE_URL } from '@/services/constants';

export const getFavorites = (access: string) => {
  console.log('Get Favorites URL:', `${BASE_URL}/catalog/track/favorite/all/`);
  return axios.get(`${BASE_URL}/catalog/track/favorite/all/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
};

export const addLike = (access: string, trackId: number) => {
  console.log('Add Like URL:', `${BASE_URL}/catalog/track/${trackId}/favorite/`);
  return axios.post(`${BASE_URL}/catalog/track/${trackId}/favorite/`, {}, {
    headers: { Authorization: `Bearer ${access}` },
  });
};

export const removeLike = (access: string, trackId: number) => {
  console.log('Remove Like URL:', `${BASE_URL}/catalog/track/${trackId}/favorite/`);
  return axios.delete(`${BASE_URL}/catalog/track/${trackId}/favorite/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
};