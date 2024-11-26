import instance from "../axios";

const API_URL_CLIENT = 'http://localhost:4000/api/client/comment';
const API_URL_ADMIN = 'http://localhost:4000/api/admin/comment';
export interface Comment {
  avatar: string ;
  createdAt: string;
  _id: string;
  content: string;
  rating: number;
  id_user:string;
  likes:string[];
}
// import { HomeAllProductResponse} from "../product_v2/client/types/homeAllProduct";

export const addComment = async (slug: string, commentData: { content: string; id_user: string; rating: number }) => {
  try {
    const response = await instance.post(`${API_URL_CLIENT}/addComment/${slug}`, commentData, {
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
    const response = await instance.get(`${API_URL_CLIENT}/comment/${id}`);
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
    const response = await instance.get(`${API_URL_CLIENT}/comment`);
  
      return response.data;
    
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const deleteRepComment = async (id:string) => {
  try {
    const response = await instance.delete(`${API_URL_ADMIN}/repComment/${id}`);
      return response.data;
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const getRepComment = async (id:string) =>{
  try{
    const response = await instance.get(`${API_URL_CLIENT}/repComment/${id}`);
    return response.data;
  }catch(error){
    throw error;
  }
};
export const postRepComment = async (id:string, commentData: { content: string }) =>{
  try{
    const response = await instance.post(`${API_URL_ADMIN}/repComment/${id}`,commentData);
    return response.data;
  }catch(error){
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const getCommentProduct = async (slug: string) => {
  try {
    const response = await instance.get(`${API_URL_CLIENT}/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCommentProducAdmin = async (slug: string,page:number,limit:number) => {
  try {
    const response = await instance.get(`${API_URL_ADMIN}/listDetailComment/${slug}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCommentAdmin = async (page:number,limit:number) => {
  try {
    const response = await instance.get(`${API_URL_ADMIN}/getCommentAdmin?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    return error; 
  }
};
export const deleteCommentAdmin = async (idProduct:string,idComment:string) => {
  try {
    const response = await instance.delete(`${API_URL_ADMIN}/${idProduct}/${idComment}`);
    return response.data;
  } catch (error) {
    throw error; 
  }
};
export const getUserComment = async (idUser: string) => {
  try {
    const response = await instance.get(`${API_URL_CLIENT}/userComment/${idUser}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const softDeleteComment = async (commentId: string) => {
  try {
    const response = await instance.patch(`${API_URL_ADMIN}/softDelete/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const restoreComment = async (id: string) => {
  try {
    const response = await instance.patch(`${API_URL_ADMIN}/restore/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const getCommentDelete = async (page:number,limit:number) => {
  try {
    const response = await instance.get(`${API_URL_ADMIN}/getCommentDelete?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const addLike = async (slug:string,commentData: { userId: string,commentId:string }) => {
  try {
    const response = await instance.put(`${API_URL_CLIENT}/addLike/${slug}`,commentData);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const editComment = async (slug: string, commentData: { content: string; id_user: string; rating: number }) => {
  try {
    const response = await instance.put(`${API_URL_CLIENT}/editCommnet/${slug}`, commentData, {
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

