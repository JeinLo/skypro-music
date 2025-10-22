import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/sharedTypes';

// type InitialStateType = {
//   currentTrack: TrackType | null;
//   isPlay: boolean;
//   currentPlaylist: TrackType[];
//   shuffledPlaylist: TrackType[];
//   isShuffle: boolean;
//   allTracks: TrackType[];
//   fetchError: null | string;
//   fetchIsLoading: boolean;
// };

// const initialState: InitialStateType = {
//   currentTrack: null,
//   isPlay: false,
//   currentPlaylist: [],
//   shuffledPlaylist: [],
//   isShuffle: false,
//   allTracks: [],
//   fetchError: null,
//   fetchIsLoading: true,
// };

export interface TrackState {
  playlist: TrackType[];
  shufflePlaylist: TrackType[];
  currentTrack: TrackType | null;
  isPlay: boolean;
  isShuffle: boolean;
  favoriteTrackIds: number[];
}

const initialState: TrackState = {
  playlist: [],
  shufflePlaylist: [],
  currentTrack: null,
  isPlay: false,
  isShuffle: false,
  favoriteTrackIds: [],
};

// Функция для создания перемешанного плейлиста
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
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
      if (action.payload && state.playlist.length > 0) {
        state.shufflePlaylist = shuffleArray(state.playlist);
      } else {
        state.shufflePlaylist = [];
      }
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const trackId = action.payload;
      if (state.favoriteTrackIds.includes(trackId)) {
        state.favoriteTrackIds = state.favoriteTrackIds.filter((id) => id !== trackId);
      } else {
        state.favoriteTrackIds.push(trackId);
      }
    },
    setNextTrack: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;
      const activePlaylist = state.isShuffle ? state.shufflePlaylist : state.playlist;
      const currentIndex = activePlaylist.findIndex(
        (track) => track._id === state.currentTrack?._id,
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
        (track) => track._id === state.currentTrack?._id,
      );
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        state.currentTrack = activePlaylist[prevIndex];
        state.isPlay = true;
      }
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
      if (state.isShuffle && state.playlist.length > 0) {
        state.shufflePlaylist = shuffleArray(state.playlist);
      } else {
        state.shufflePlaylist = [];
      }
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
  setNextTrack,
  setPrevTrack,
  toggleShuffle,
} = trackSlice.actions;

export default trackSlice.reducer;