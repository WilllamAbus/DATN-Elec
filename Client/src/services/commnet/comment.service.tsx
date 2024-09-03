import axios from "axios";
const API_URL = 'http://localhost:4000/api/product';
// export const commentProduct = async (id: string) => {
//   try {
//     const response = await axios.get(`${API_URL}/comment/${id}`);
//     if (response.data && Array.isArray(response.data)) {
//       return response.data;
//     } else {
//       console.error("Unexpected data format:", response.data);
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching product comments:", error);
//     throw error;
//   }
// };
export const commentAllProduct = async () => {
  try {
    const response = await axios.get(`${API_URL}/comment`);
  
      return response.data;
    
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const deletelComment = async (id:string) => {
  try {
    const response = await axios.delete(`${API_URL}/comment/${id}`);
      return response.data;
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const getRepComment = async (id:string) =>{
  try{
    const response = await axios.get(`${API_URL}/repComment/${id}`);
    return response.data;
  }catch(error){
    console.error("Error fetching product comments:", error);
    throw error;
  }
};
export const postRepComment = async (id:string, commentData: { content: string; id_comment: string }) =>{
  try{
    const response = await axios.post(`${API_URL}/repComment/${id}`,commentData);
    return response.data;
  }catch(error){
    console.error("Error fetching product comments:", error);
    throw error;
  }
};