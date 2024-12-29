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
    // Lấy danh sách các sản phẩm đã xem từ localStorage
    const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');

    const existingProduct = viewedProducts.find((product: { id: string; timestamp: number }) => product.id === id);

    if (existingProduct) {
      // Kiểm tra thời gian đã trôi qua kể từ khi sản phẩm được xem
      const timeElapsed = Date.now() - existingProduct.timestamp;

      // Nếu chưa đủ 2 phut, trả về thông báo (giay 5*1000)
      if (timeElapsed < 2* 60 * 1000) {
        return { message: 'Product already viewed recently' };
      } else {
        // Nếu đã quá 2 phuy, xóa sản phẩm khỏi localStorage
        const newViewedProducts = viewedProducts.filter((product: { id: string }) => product.id !== id);
        localStorage.setItem('viewedProducts', JSON.stringify(newViewedProducts));
      }
    }

    // Nếu sản phẩm chưa được xem hoặc đã quá 5 giây, thêm sản phẩm vào localStorage
    viewedProducts.push({ id, timestamp: Date.now() });
    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));

    // Thiết lập timeout để tăng view cho sản phẩm sau 5 giây
    setTimeout(async () => {
      // Gọi API tăng view cho sản phẩm
      const response = await instance.put(
        `/client/product/upView/${id}`,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Xóa sản phẩm khỏi localStorage sau khi đã tăng view
      const updatedViewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
      const newViewedProducts = updatedViewedProducts.filter((product: { id: string }) => product.id !== id);
      localStorage.setItem('viewedProducts', JSON.stringify(newViewedProducts));

      return response.data;
    }, 2 * 60 * 1000); // 5 phut 

    // Trả về thông báo cho người dùng
    return { message: 'View will be counted after 5 seconds' };
  };



export const searchProduct = async (keyword: string) => {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const response = await instance.get(`/client/product/search/${encodedKeyword}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};