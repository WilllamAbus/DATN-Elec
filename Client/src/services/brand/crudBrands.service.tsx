import instance from "../axios";

export const listBrands = async () => {
  try {
    const response = await instance.get("/brands/list");

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.msg || "Lỗi không xác định khi lấy danh sách sản phẩm");
    }
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const addBrand = async (brand :FormData) =>{
  try{
    const response = await instance.post("/brand/add", brand, {
      headers: {
        'Content-Type': 'multipart/form-data'
      ,}
    });
    return response.data;
  }catch(error){
    console.error("Error adding brand:", error);
    throw error;
  }
}