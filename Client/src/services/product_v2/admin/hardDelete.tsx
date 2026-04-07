import instance from "../../axios";
import { ResponseSuccess, STATUS_CODES, RESPONSE_MESSAGES_CRUD,ErrorResponse } from "./types/hardDelete";
import { AxiosError } from "axios"; 

export const hardDeleteProduct = async (id: string): Promise<ResponseSuccess> => {
  try {
    const response = await instance.delete(`/admin/product/hardDelete/${id}`);
    
    return {
      success: true,
      err: 0,
      msg: RESPONSE_MESSAGES_CRUD.SUCCESS_DELETE,
      status: STATUS_CODES.SUCCESS_DELETE,
      data: response.data, 
    };
  } catch (error) {
    const axiosError = error as AxiosError; 

    const errorResponse = axiosError.response?.data as ErrorResponse;
    return {
      success: false,
      err: 1,
      msg: errorResponse?.msg || RESPONSE_MESSAGES_CRUD.SERVER_ERROR,
      status: axiosError.response?.status || STATUS_CODES.SERVER_ERROR,
      data: undefined, 
    };
  }
};
