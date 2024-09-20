import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ContactData {
  id_user: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}

export const contactFormThunk = createAsyncThunk(
  'contacts/send',
  async (contactData: ContactData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/contact', contactData);
      return response.data; // Dữ liệu trả về từ server
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Nếu error là từ axios
        return rejectWithValue(error.response?.data || 'Có lỗi xảy ra');
      }
      return rejectWithValue('Có lỗi không xác định xảy ra.');
    }
  }
);