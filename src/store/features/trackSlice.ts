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
    setCurrentTrack: (state, action: PayloadAction<{ track: TrackType; playlist: TrackType[] }>) => {
      state.currentTrack = action.payload.track;
      state.playlist = action.payload.playlist;
      state.shufflePlaylist = [...action.payload.playlist].sort(() => Math.random() - 0.5);
      state.isPlay = true; // Включаем воспроизведение при выборе трека
    },
    setIsPlay: (state) => {
      state.isPlay = !state.isPlay; // Упрощённое переключение play/pause
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

export const { setCurrentTrack, setIsPlay, setNextTrack, setPrevTrack, toggleShuffle } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;