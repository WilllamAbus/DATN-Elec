import instance from "../axios";

// const API_URL_CLIENT = 'http://localhost:4000/api/client/comment';
// const API_URL_ADMIN = 'http://localhost:4000/api/admin/comment';
export interface Comment {
  avatar: string ;
  createdAt: string;
  _id: string;
  content: string;
  rating: number;
  id_user?: {
    name: string;
  } ;
  likes:string[];
  replies:string[];
}

export const addComment = async (slug: string, commentData: { content: string; id_user: string; rating: number }) => {
  try {
    const response = await instance.post(`/client/comment/addComment/${slug}`, commentData, {
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
    const response = await instance.get(`/client/comment/comment/${id}`);
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
    const response = await instance.get(`/client/comment/comment`);
  
      return response.data;
    
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const deleteRepComment = async (id:string) => {
  try {
    const response = await instance.delete(`/admin/comment/repComment/${id}`);
      return response.data;
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const getRepComment = async (id:string) =>{
  try{
    const response = await instance.get(`/client/comment/repComment/${id}`);
    return response.data;
  }catch(error){
    throw error;
  }
};
export const postRepComment = async (id:string, commentData: { content: string }) =>{
  try{
    const response = await instance.post(`/admin/comment/repComment/${id}`,commentData);
    return response.data;
  }catch(error){
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const getCommentProduct = async (slug: string) => {
  try {
    const response = await instance.get(`/client/comment/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCommentProducAdmin = async (slug: string,page:number,limit:number) => {
  try {
    const response = await instance.get(`/admin/comment/listDetailComment/${slug}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getCommentAdmin = async (page:number,limit:number) => {
  try {
    const response = await instance.get(`/admin/comment/getCommentAdmin?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    return error; 
  }
};
export const deleteCommentAdmin = async (idProduct:string,idComment:string) => {
  try {
    const response = await instance.delete(`/admin/comment/${idProduct}/${idComment}`);
    return response.data;
  } catch (error) {
    throw error; 
  }
};
export const softDeleteComment = async (commentId: string) => {
  try {
    const response = await instance.patch(`/admin/comment/softDelete/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const restoreComment = async (id: string) => {
  try {
    const response = await instance.patch(`/admin/comment/restore/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const getCommentDelete = async (page:number,limit:number) => {
  try {
    const response = await instance.get(`/admin/comment/getCommentDelete?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const addLike = async (slug:string,commentData: { userId: string,commentId:string }) => {
  try {
    const response = await instance.put(`/client/comment/addLike/${slug}`,commentData);
    return response.data;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    throw error; 
  }
};
export const editComment = async (slug: string, commentData: { content: string; id_user: string; rating: number }) => {
  try {
    const response = await instance.put(`/client/comment/editCommnet/${slug}`, commentData, {
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

