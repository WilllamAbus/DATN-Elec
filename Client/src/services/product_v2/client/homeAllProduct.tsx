import instance from "../../axios";
import { HomeAllProductResponse, ProductResponse  } from "./types/homeAllProduct";
export const homeAllProduct = async (): Promise<HomeAllProductResponse> => {
  try {
    const response = await instance.get<HomeAllProductResponse>("/client/product/homeAllProduct");
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: "lõi",
      status: 500,
      products: [],
      error: error.message,
    };
  }
};
export const getProductByID = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await instance.get<ProductResponse>(`/client/product/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: "Lỗi",
      status: 500,
      product: null,
      error: error.message,
    };
  }
};
export const getProductShopping = async (id: string): Promise<HomeAllProductResponse> => {
  try {
    const response = await instance.get<HomeAllProductResponse>(`/client/product/shopping/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: "Lỗi",
      status: 500,
      products: [],
      error: error.message,
    };
  }
};
export const upViewProduct = async (id: string) => {
  const response = await instance.put(
    `/client/product/upView/${id}`,
    {},
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const searchProduct = async (keyword:string)=> {
  try{
    const response = await instance.get(`/client/product/search/${keyword}`);
    return response.data;
  }catch (error){
    console.log(error);
    
  }
  
}