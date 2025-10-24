// src/store/features/trackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/sharedTypes';


const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export interface TrackState {
  playlist: TrackType[];
  shufflePlaylist: TrackType[];
  currentTrack: TrackType | null;
  isPlay: boolean;
  isShuffle: boolean;
  favoriteTrackIds: number[];
  favoriteTracks: TrackType[];
}

const initialState: TrackState = {
  playlist: [],
  shufflePlaylist: [],
  currentTrack: null,
  isPlay: false,
  isShuffle: false,
  favoriteTrackIds: [],
  favoriteTracks: [],
};

export const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
    },
    setShufflePlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.shufflePlaylist = action.payload;
    },
    setCurrentTrack: (
      state,
      action: PayloadAction<{ track: TrackType; playlist: TrackType[] }>,
    ) => {
      state.currentTrack = action.payload.track;
      state.playlist = action.payload.playlist;
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setIsShuffle: (state, action: PayloadAction<boolean>) => {
      state.isShuffle = action.payload;
      state.shufflePlaylist = action.payload && state.playlist.length > 0
        ? shuffleArray(state.playlist)
        : [];
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.favoriteTrackIds.includes(id)) {
        state.favoriteTrackIds = state.favoriteTrackIds.filter((tid) => tid !== id);
      } else {
        state.favoriteTrackIds.push(id);
      }
    },
    addLikedTracks: (state, action: PayloadAction<TrackType>) => {
      if (!state.favoriteTracks.some((t) => t._id === action.payload._id)) {
        state.favoriteTracks.push(action.payload);
      }
    },
    removeLikedTracks: (state, action: PayloadAction<TrackType>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (t) => t._id !== action.payload._id,
      );
    },
    setNextTrack: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;
      const activePlaylist = state.isShuffle ? state.shufflePlaylist : state.playlist;
      const currentIndex = activePlaylist.findIndex(
        (t) => t._id === state.currentTrack?._id,
      );
      const nextIndex = currentIndex + 1;
      if (nextIndex < activePlaylist.length) {
        state.currentTrack = activePlaylist[nextIndex];
        state.isPlay = true;
      }
    },
    setPrevTrack: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;
      const activePlaylist = state.isShuffle ? state.shufflePlaylist : state.playlist;
      const currentIndex = activePlaylist.findIndex(
        (t) => t._id === state.currentTrack?._id,
      );
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        state.currentTrack = activePlaylist[prevIndex];
        state.isPlay = true;
      }
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
      state.shufflePlaylist = state.isShuffle && state.playlist.length > 0
        ? shuffleArray(state.playlist)
        : [];
    },
    clearAllTracks: (state) => {
      state.favoriteTrackIds = [];
      state.favoriteTracks = [];
      state.playlist = [];
      state.shufflePlaylist = [];
      state.currentTrack = null;
      state.isPlay = false;
      state.isShuffle = false;
    },
  },
});

export const {
  setPlaylist,
  setShufflePlaylist,
  setCurrentTrack,
  setIsPlay,
  setIsShuffle,
  toggleFavorite,
  addLikedTracks,
  removeLikedTracks,
  setNextTrack,
  setPrevTrack,
  toggleShuffle,
  clearAllTracks,
} = trackSlice.actions;

export default trackSlice.reducer;