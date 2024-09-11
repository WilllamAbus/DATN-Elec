import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Service } from '../../types/bidding/bidding';
import { getAllServices } from './serviceRefThunk';

interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.services = action.payload;
        state.loading = false;
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      });
  },
});

export default serviceSlice.reducer;
