// store/discountThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Discount } from '../../types/Discount.d';
import {
  fetchAllDiscounts as fetchAllDiscountsAPI,
  createDiscount as createDiscountAPI,
  updateDiscount as updateDiscountAPI,
  deleteDiscount as deleteDiscountAPI,
  getDiscountById as fetchDiscountByID
} from '../../services/discount/discount.services';

export const fetchDiscounts = createAsyncThunk<Discount[]>(
  'discounts/fetchDiscounts',
  async () => {
    return await fetchAllDiscountsAPI();
  }
);

export const fetchDiscountById = createAsyncThunk<Discount, string>(
    'discounts/fetchDiscountById',
    async (id: string) => {
      return await fetchDiscountByID(id);
    }
  );

export const createDiscount = createAsyncThunk<Discount, Discount>(
  'discounts/createDiscount',
  async (newDiscount) => {
    return await createDiscountAPI(newDiscount);
  }
);

export const updateDiscount = createAsyncThunk<Discount, { id: string; updatedDiscount: Discount }>(
  'discounts/updateDiscount',
  async ({ id, updatedDiscount }) => {
    return await updateDiscountAPI(id, updatedDiscount);
  }
);

export const deleteDiscount = createAsyncThunk<void, string>(
  'discounts/deleteDiscount',
  async (id) => {
    await deleteDiscountAPI(id);
  }
);
