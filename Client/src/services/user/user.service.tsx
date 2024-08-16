import axios from "axios";
const API_URL = 'http://localhost:4000/api/product';
export const getOneUser = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/userID/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };