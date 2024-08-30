import instance from "../axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getCartList = async () => {
  const response = await instance.get(`${API_URL}/cart/list`);
  return response.data;
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity = 1
) => {
  const response = await instance.post(`${API_URL}/cart/add`, {
    user: userId,
    items: [
      {
        product: productId,
        quantity,
      },
    ],
  });
  return response.data;
};

export const updateCart = async (
  cartId: string,
  items: { product: string; quantity: number }[]
) => {
  const response = await instance.put(`${API_URL}/cart/${cartId}`, { items });
  return response.data;
};
export const getCartById = async (cartId: string) => {
  const response = await instance.get(`${API_URL}/carts/${cartId}`);
  return response.data;
};

export const deleteCart = async (cartId: string) => {
  const response = await instance.delete(`${API_URL}/carts/${cartId}}`);
  return response.data;
};
