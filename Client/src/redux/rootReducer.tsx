import { combineReducers } from '@reduxjs/toolkit';
import categoriesSlice from './categories/categoriesSlice';
// Import other reducers as needed

const rootReducer = combineReducers({
  categories: categoriesSlice,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>; // Type for the store's state

export default rootReducer;