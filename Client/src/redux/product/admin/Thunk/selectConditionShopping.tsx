import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectConditionShopping } from '../../../../services/product_v2/admin/selects/selectCondition';
import { SelectConditionShoppingResponse } from '../../../../services/product_v2/admin/types/select/conditionSP';

export const selectConditionShoppingThunk = createAsyncThunk<SelectConditionShoppingResponse, void, { rejectValue: string }>(
  'conditionShopping/select',
  async (_, { rejectWithValue }) => {
    try {
      const response = await selectConditionShopping();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lỗi không xác định');
    }
  }
);
