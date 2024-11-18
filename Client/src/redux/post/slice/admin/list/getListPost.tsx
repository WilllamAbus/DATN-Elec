import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getListPostThunk } from "../../../thunk";
import { Post, Pagination, ResponsePost } from "../../../../../services/post/admin/types/listPost";

interface ListPostState {
   posts: Post[];
   status: "idle" | "loading" | "success" | "fail";
   error: string | null;
   pagination: Pagination | null;
   total: number | null;
}

const initialState: ListPostState = {
   posts: [],
   status: "idle",
   error: null,
   pagination: null,
   total: null,
};

const listPostSlice = createSlice({
   name: "posts",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(getListPostThunk.pending, (state) => {
            state.status = "loading";
         })
         .addCase(
            getListPostThunk.fulfilled,
            (state, action: PayloadAction<ResponsePost>) => {
               state.status = "success";
               state.posts = action.payload.data.posts;
               state.pagination = action.payload.pagination;
               state.total = action.payload.data.total;
            }
         )
         .addCase(getListPostThunk.rejected, (state, action) => {
            state.status = "fail";
            state.error = (action.payload as string) || "Lỗi không xác định";
         });
   },
});

export default listPostSlice.reducer;
