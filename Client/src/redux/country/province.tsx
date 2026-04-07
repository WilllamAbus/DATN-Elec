import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProvinces,
  getDistricts,
  getWards,
} from "../../services/country/province";

// Thunk để lấy tỉnh thành
export const fetchProvinces = createAsyncThunk(
  "location/fetchProvinces",
  async (_, thunkAPI) => {
    try {
      const data = await getProvinces();
      return data.data; // Giả sử data chứa cả ID và tên của các tỉnh thành
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching provinces");
    }
  }
);

// Thunk để lấy quận huyện
export const fetchDistricts = createAsyncThunk(
  "location/fetchDistricts",
  async (provinceId: string, thunkAPI) => {
    try {
      const data = await getDistricts(provinceId);
      return data.data; // Giả sử data chứa cả ID và tên của các quận huyện
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching districts");
    }
  }
);

// Thunk để lấy phường xã
export const fetchWards = createAsyncThunk(
  "location/fetchWards",
  async (districtId: string, thunkAPI) => {
    try {
      const data = await getWards(districtId);
      return data.data; // Giả sử data chứa cả ID và tên của các phường xã
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching wards");
    }
  }
);
// redux/country/province.ts

// import { createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getProvinces,
//   getDistricts,
//   getWards,
// } from "../../services/country/province";

// export const fetchProvinces = createAsyncThunk(
//   "country/fetchProvinces",
//   async () => {
//     const response = await getProvinces();
//     return response.results; // Dữ liệu từ API được trả về trong trường results
//   }
// );

// export const fetchDistricts = createAsyncThunk(
//   "country/fetchDistricts",
//   async (provinceId: string) => {
//     const response = await getDistricts(provinceId);
//     return response.results; // Dữ liệu từ API được trả về trong trường results
//   }
// );

// export const fetchWards = createAsyncThunk(
//   "country/fetchWards",
//   async (districtId: string) => {
//     const response = await getWards(districtId);
//     return response.results; // Dữ liệu từ API được trả về trong trường results
//   }
// );
