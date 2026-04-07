import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializedError } from "@reduxjs/toolkit";
import { getOneScreenThunk } from "../../../../thunk";
import { Screen } from "../../../../../../services/attribute/types/screen/getOneScreen";

interface ScreenState {
   screen: Screen | null;
   status: "idle" | "loading" | "succeeded" | "failed";
   error: SerializedError | null;
}

const initialState: ScreenState = {
   screen: null,
   status: "idle",
   error: null,
};

const getOneScreenSlice = createSlice({
   name: "screen/getone",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(getOneScreenThunk.pending, (state) => {
            state.status = "loading";
            state.error = null;
         })
         .addCase(getOneScreenThunk.fulfilled, (state, action: PayloadAction<Screen>) => {
            state.status = "succeeded";
            state.screen = action.payload;
         })
         .addCase(
            getOneScreenThunk.rejected,
            (state, action: PayloadAction<unknown, string, never, SerializedError>) => {
               state.status = "failed";
               state.error = action.error;
            }
         );
   },
});

export default getOneScreenSlice.reducer;
