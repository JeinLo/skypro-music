import axios from 'axios';
import { BASE_URL } from '../constants';

const api = axios.create({
  baseURL: BASE_URL,
});

export const addLike = async (access: string, trackId: number) => {
  await api.post(`/catalog/track/${trackId}/favorite/`, {}, {
    headers: { Authorization: `Bearer ${access}` },
  });
};

export const removeLike = async (access: string, trackId: number) => {
  await api.delete(`/catalog/track/${trackId}/favorite/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
};

export const getFavorites = async (access: string) => {
  const res = await api.get('/catalog/track/favorite/all/', {
    headers: { Authorization: `Bearer ${access}` },
  });
  return res.data;
};