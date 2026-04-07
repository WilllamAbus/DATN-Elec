// import { createSlice } from "@reduxjs/toolkit";
// import { fetchProvinces, fetchDistricts, fetchWards } from "./province";

// interface LocationState {
//   provinces: { province_id: string; province_name: string }[];
//   districts: { district_id: string; district_name: string }[];
//   wards: { ward_id: string; ward_name: string }[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: LocationState = {
//   provinces: [],
//   districts: [],
//   wards: [],
//   status: "idle",
//   error: null,
// };

// const locationSlice = createSlice({
//   name: "location",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProvinces.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchProvinces.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.provinces = action.payload;
//       })
//       .addCase(fetchProvinces.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       })
//       .addCase(fetchDistricts.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchDistricts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.districts = action.payload;
//       })
//       .addCase(fetchDistricts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       })
//       .addCase(fetchWards.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchWards.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.wards = action.payload;
//       })
//       .addCase(fetchWards.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       });
//   },
// });

// export default locationSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { fetchProvinces, fetchDistricts, fetchWards } from "./province";

interface LocationState {
  provinces: { id: string; full_name: string }[];
  districts: { id: string; full_name: string }[];
  wards: { id: string; full_name: string }[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LocationState = {
  provinces: [],
  districts: [],
  wards: [],
  status: "idle",
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchDistricts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.districts = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchWards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wards = action.payload;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default locationSlice.reducer;
