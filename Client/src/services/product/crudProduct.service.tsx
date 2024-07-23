import instance from "../axios";

interface Product {
  name: string;
  price: number;
  image?: string;
  quantity: number;
  categoryid: string;
  createdAt?: string; 
  weight?: string;
  brand?: string;
  color?: string;
  description?: string;
  discount: number; 
}

export const addProduct = async (product: Product) => {
  try {
    const response = await instance.post("/product/add", product);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};
