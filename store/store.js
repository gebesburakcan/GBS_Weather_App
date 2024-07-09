import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from '../store/favoritesSlice.js';

export default configureStore({
  reducer: {
    favorites: favoriteReducer,
  },
});