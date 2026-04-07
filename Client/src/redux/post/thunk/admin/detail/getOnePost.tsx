import { createAsyncThunk } from "@reduxjs/toolkit";
import { Post, GetOnePostResponse } from "../../../../../services/post/admin/types/getOnePost";
import { getOnePost } from "../../../../../services/post/admin/detail/getOnePost";

export const getOnePostThunk = createAsyncThunk<Post, string, { rejectValue: string }>(
   "post/getone",
   async (postId: string, { rejectWithValue }) => {
      try {
         const response: GetOnePostResponse = await getOnePost(postId);
         if (response.success) {
            return response.post as Post;
         } else {
            return rejectWithValue(response.msg);
         }
      } catch (error) {
         return rejectWithValue("Lỗi hệ thống");
      }
   }
);
