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
  allTracks: TrackType[];
  collectionTracks: TrackType[];
  titlePlaylist: string;
  errorMessage: string;
  filteredTracks: TrackType[];
  filters: {
    author: string[];
    genre: string[];
    sortByYear: string;
  };
  searchTrack: string;
}

const initialState: TrackState = {
  playlist: [],
  shufflePlaylist: [],
  currentTrack: null,
  isPlay: false,
  isShuffle: false,
  favoriteTrackIds: [],
  favoriteTracks: [],
  allTracks: [],
  collectionTracks: [],
  titlePlaylist: 'Треки',
  errorMessage: '',
  filteredTracks: [],
  filters: {
    author: [],
    genre: [],
    sortByYear: 'По умолчанию',
  },
  searchTrack: '',
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
      action: PayloadAction<{ track: TrackType; playlist: TrackType[] }>
    ) => {
      state.currentTrack = action.payload.track;
      state.playlist = action.payload.playlist;
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setIsShuffle: (state, action: PayloadAction<boolean>) => {
      state.isShuffle = action.payload;
      state.shufflePlaylist =
        action.payload && state.playlist.length > 0 ? shuffleArray(state.playlist) : [];
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
      if (!state.favoriteTrackIds.includes(action.payload._id)) {
        state.favoriteTrackIds.push(action.payload._id);
      }
    },
    removeLikedTracks: (state, action: PayloadAction<TrackType>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (t) => t._id !== action.payload._id
      );
      state.favoriteTrackIds = state.favoriteTrackIds.filter(
        (tid) => tid !== action.payload._id
      );
    },
    setNextTrack: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;
      const activePlaylist = state.isShuffle ? state.shufflePlaylist : state.playlist;
      const currentIndex = activePlaylist.findIndex(
        (t) => t._id === state.currentTrack?._id
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
        (t) => t._id === state.currentTrack?._id
      );
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        state.currentTrack = activePlaylist[prevIndex];
        state.isPlay = true;
      }
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
      state.shufflePlaylist =
        state.isShuffle && state.playlist.length > 0 ? shuffleArray(state.playlist) : [];
    },
    clearAllTracks: (state) => {
      state.favoriteTrackIds = [];
      state.favoriteTracks = [];
      state.playlist = [];
      state.shufflePlaylist = [];
      state.currentTrack = null;
      state.isPlay = false;
      state.isShuffle = false;
      state.allTracks = [];
      state.collectionTracks = [];
      state.titlePlaylist = 'Треки';
      state.errorMessage = '';
      state.filteredTracks = [];
      state.filters = { author: [], genre: [], sortByYear: 'По умолчанию' };
      state.searchTrack = '';
    },
    setAllTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.allTracks = action.payload;
    },
    setCollectionTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.collectionTracks = action.payload;
    },
    setFavoriteTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.favoriteTracks = action.payload;
      state.favoriteTrackIds = action.payload.map((track) => track._id);
    },
    setTitlePlaylist: (state, action: PayloadAction<string>) => {
      state.titlePlaylist = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<{ filterType: 'author' | 'genre' | 'year'; value: string }>
    ) => {
      const { filterType, value } = action.payload;
      if (filterType === 'year') {
        state.filters.sortByYear = value;
      } else {
        const currentFilters = state.filters[filterType];
        if (currentFilters.includes(value)) {
          state.filters[filterType] = currentFilters.filter((item) => item !== value);
        } else {
          state.filters[filterType].push(value);
        }
      }
    },
    setSearchTrack: (state, action: PayloadAction<string>) => {
      state.searchTrack = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { author: [], genre: [], sortByYear: 'По умолчанию' };
      state.searchTrack = '';
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
  setAllTracks,
  setCollectionTracks,
  setFavoriteTracks,
  setTitlePlaylist,
  setErrorMessage,
  setFilters,
  setSearchTrack,
  resetFilters,
} = trackSlice.actions;

export default trackSlice.reducer;