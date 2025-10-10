import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/sharedTypes';

type initialStateType = {
  currentTrack: TrackType | null;
  isPlay: boolean;
  playlist: TrackType[];
  shufflePlaylist: TrackType[];
  isShuffle: boolean;
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  isShuffle: false,
  shufflePlaylist: [],
  playlist: [],
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
    },
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
      state.shufflePlaylist = [...action.payload].sort(() => Math.random() - 0.5);
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setNextTrack: (state) => {
      const playlist = state.isShuffle ? state.shufflePlaylist : state.playlist;
      const curIndex = playlist.findIndex((el) => el._id === state.currentTrack?._id);
      if (curIndex < playlist.length - 1) {
        state.currentTrack = playlist[curIndex + 1];
        state.isPlay = true;
      } else {
        state.isPlay = false; // Останавливаем воспроизведение, если трек последний
      }
    },
    setPrevTrack: (state) => {
      const playlist = state.isShuffle ? state.shufflePlaylist : state.playlist;
      const curIndex = playlist.findIndex((el) => el._id === state.currentTrack?._id);
      if (curIndex > 0) {
        state.currentTrack = playlist[curIndex - 1];
        state.isPlay = true;
      }
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
      if (state.isShuffle) {
        state.shufflePlaylist = [...state.playlist].sort(() => Math.random() - 0.5);
      }
    },
  },
});

export const { setCurrentTrack, setIsPlay, setCurrentPlaylist, setNextTrack, setPrevTrack, toggleShuffle } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;