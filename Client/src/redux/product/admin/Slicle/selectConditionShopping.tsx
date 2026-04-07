import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { selectConditionShoppingThunk } from '../Thunk';
import { SelectConditionShoppingResponse, ConditionShopping } from '../../../../services/product_v2/admin/types/select/conditionSP';

interface ConditionShoppingState {
  conditionShopping: ConditionShopping[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: ConditionShoppingState = {
  conditionShopping: [],
  status: 'idle',
  error: null,
};

const selectConditionShoppingSlice = createSlice({
  name: 'conditionShopping/select',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(selectConditionShoppingThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(selectConditionShoppingThunk.fulfilled, (state, action: PayloadAction<SelectConditionShoppingResponse>) => {
        state.status = 'success';
        state.conditionShopping = action.payload.selectConditionShopping;  // Gán dữ liệu condition shopping vào state.conditionShopping
      })
      .addCase(selectConditionShoppingThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'fail';
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export default selectConditionShoppingSlice.reducer;
