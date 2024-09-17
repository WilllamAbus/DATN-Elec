import axios from "axios";
const API_URL_CLIENT = 'http://localhost:4000/api/client/comment';
const API_URL_ADMIN = 'http://localhost:4000/api/admin/comment';
export interface Comment {
  _id: string;
  content: string;
  rating: number;
  user:string;
  // Thêm các trường khác nếu có
}
import { HomeAllProductResponse} from "../product_v2/client/types/homeAllProduct";

export const addComment = async (id: string, commentData: { content: string; user: string; rating: number }) => {
  try {
    const response = await axios.post(`${API_URL_CLIENT}/addComment/${id}`, commentData, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error adding comment:', error);
    throw error; 
  }
};
export const commentProduct = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL_CLIENT}/comment/${id}`);
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Unexpected data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const commentAllProduct = async () => {
  try {
    const response = await axios.get(`${API_URL_CLIENT}/comment`);
  
      return response.data;
    
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const deleteRepComment = async (id:string) => {
  try {
    const response = await axios.delete(`${API_URL_ADMIN}/repComment/${id}`);
      return response.data;
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const getRepComment = async (id:string) =>{
  try{
    const response = await axios.get(`${API_URL_CLIENT}/repComment/${id}`);
    return response.data;
  }catch(error){
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const postRepComment = async (id:string, commentData: { content: string; id_comment: string }) =>{
  try{
    const response = await axios.post(`${API_URL_ADMIN}/repComment/${id}`,commentData);
    return response.data;
  }catch(error){
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const getCommentProduct = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL_CLIENT}/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching product comments:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; 
  }
};
export const getCommentAdmin = async () => {
  try {
    const response = await axios.get<HomeAllProductResponse>(`${API_URL_ADMIN}/getCommentAdmin`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching product comments:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; 
  }
};
export const deleteCommentAdmin = async (idProduct:string,idComment:string) => {
  try {
    const response = await axios.delete(`${API_URL_ADMIN}/${idProduct}/${idComment}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching product comments:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; 
  }
};
