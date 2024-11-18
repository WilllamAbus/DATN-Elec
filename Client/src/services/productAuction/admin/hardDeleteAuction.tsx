import instance from "../../axios";
import {
  ResponseSuccess,
  STATUS_CODES,
  ERRORS,
  SUCCESS,
  ErrorResponse,
} from "../types/hardDeleteAndRestoreAuction";
import { AxiosError } from "axios";

export const hardDeleteAuction = async (id: string): Promise<ResponseSuccess> => {
  try {
    const response = await instance.delete(`/admin/productAuction/hard-delete-auction/${id}`);
    if (response.data.success) {
      return {
        success: true,
        err: 0,
        msg: response.data.msg || SUCCESS.PRODUCT_DELETED,
        status: response.status || STATUS_CODES.SUCCESS_DELETE,
        data: response.data.data,
      };
    }
    return {
      success: false,
      err: 1,
      msg: response.data.msg || ERRORS.SERVER_ERROR,
      status: response.status || STATUS_CODES.SERVER_ERROR,
      data: undefined,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorResponse = axiosError.response?.data as ErrorResponse;

    return {
      success: false,
      err: 1,
      msg: errorResponse?.msg || ERRORS.SERVER_ERROR,
      status: axiosError.response?.status || STATUS_CODES.SERVER_ERROR,
      data: undefined,
    };
  }
};

