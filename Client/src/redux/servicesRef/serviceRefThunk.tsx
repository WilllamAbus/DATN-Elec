import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchServices } from '../../services/serviceRef/serviceRef';

export const getAllServices = createAsyncThunk('services/getAll', async () => {
  const services = await fetchServices();
  return services;
});
