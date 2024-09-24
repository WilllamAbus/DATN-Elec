import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { listCateNavItemThunk } from '../Thunk';
import { NavItem, ListNavItemResponse } from '../types/listcatenav';

interface NavItemState {
  navItems: NavItem[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: NavItemState = {
  navItems: [],
  status: 'idle',
  error: null,
};

const listNavItemsSlice = createSlice({
  name: 'listCateNav',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listCateNavItemThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(listCateNavItemThunk.fulfilled, (state, action: PayloadAction<ListNavItemResponse>) => {
        state.status = 'success';
        state.navItems = action.payload.navItems;
      })
      .addCase(listCateNavItemThunk.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.error.message || 'Lỗi không xác định';
      });
  },
});

export default listNavItemsSlice.reducer;
