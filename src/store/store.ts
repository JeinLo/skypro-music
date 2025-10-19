import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import trackReducer from '@/store/features/trackSlice'; // Исправляем импорт

// Создаем хранилище
export const makeStore = () => {
  return configureStore({
    reducer: {
      tracks: trackReducer, // Используем trackReducer вместо trackSliceReducer
    },
    // middleware уже включает redux-thunk по умолчанию в RTK
  });
};

// Выводим типы из хранилища
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Типизированные хуки для нового TypeScript
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;