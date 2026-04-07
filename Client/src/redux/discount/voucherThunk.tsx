// store/VoucherThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Voucher } from '../../types/Voucher.d';
import {
  fetchAllVouchers as fetchAllVouchersAPI,
  createVoucher as createVoucherAPI,
  updateVoucher as updateVoucherAPI,
  deleteVoucher as deleteVoucherAPI,
  getVoucherById as fetchVoucherByID,

  sofDeleteVoucher as softDeleteVoucherApi,
  deleteListVoucher as deleteListVoucherApi,

  restore as restoreApi,
  ApiResponse as  ApiResponse
} from '../../services/voucher/voucher.services';

export const fetchVouchers = createAsyncThunk<Voucher[]>(
  'Vouchers/fetchVouchers',
  async () => {
    return await fetchAllVouchersAPI();
  }
);

export const fetchVoucherById = createAsyncThunk<Voucher, string>(
    'Vouchers/fetchVoucherById',
    async (id: string) => {
      return await fetchVoucherByID(id);
    }
  );

export const createVoucher = createAsyncThunk<Voucher, Voucher>(
  'Vouchers/createVoucher',
  async (newVoucher) => {
    return await createVoucherAPI(newVoucher);
  }
);

export const updateVoucher = createAsyncThunk<Voucher, { id: string; updatedVoucher: Voucher }>(
  'Vouchers/updateVoucher',
  async ({ id, updatedVoucher }) => {
    return await updateVoucherAPI(id, updatedVoucher);
  }
);

export const deleteVoucher = createAsyncThunk<void, string>(
  'Vouchers/deleteVoucher',
  async (id) => {
    await deleteVoucherAPI(id);
  }
);



export const softDeleteVoucherThunk = createAsyncThunk<Voucher, string>(
  'order/softDeleteOrder',
  async (voucherId: string, { rejectWithValue }) => {
    try {
      const response = await softDeleteVoucherApi(voucherId);

      // Check if response contains the expected data
      if (!response || !response.data) {
        return rejectWithValue('No data received from softDeleteOrder');
      }
      return response.data
      ;  // Return the OrderData part of the response
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error(error);
      return rejectWithValue('Failed to delete order');
    }
  }
);

export const fetchDeletedVoucherThunk = createAsyncThunk<Voucher[]>(
  'order/fetchDeletedOrder',
  async () => {
    try {
      const response: ApiResponse = await deleteListVoucherApi();
      console.log("responseSoftDev:", response);
      
      return response.data; // Ensure this is Category[]
    } catch (error) {
      console.error('Error fetching categories:', error);
      return []; // Return an empty array on error
    }
  }
);


export const restoreVoucherThunk = createAsyncThunk<Voucher, string>(
  'order/restoreOrder',
  async (voucherId: string, { rejectWithValue }) => {
    try {
      const response = await restoreApi(voucherId);
      if (!response || !response.data) {
        return rejectWithValue('No data received from restoreOrder');
      }
      return response.data; // Return the restored order data
    } catch (error) {
      console.error('Error restoring order:', error);
      return rejectWithValue('Failed to restore order');
    }
  }
);