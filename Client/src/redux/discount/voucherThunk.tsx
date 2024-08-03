// store/VoucherThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Voucher } from '../../types/Voucher.d';
import {
  fetchAllVouchers as fetchAllVouchersAPI,
  createVoucher as createVoucherAPI,
  updateVoucher as updateVoucherAPI,
  deleteVoucher as deleteVoucherAPI,
  getVoucherById as fetchVoucherByID
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
