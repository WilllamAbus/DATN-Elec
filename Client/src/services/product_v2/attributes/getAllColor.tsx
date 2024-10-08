import instance from "../../axios";
import { 
  GetAllColorResponse, 
  STATUS_OK, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_ERROR, 
  createErrorResponse 
} from "../types/attributes/getAllColor";
export const getAllColor = async (): Promise<GetAllColorResponse> => {
  try {
    const response = await instance.get<GetAllColorResponse>("/attributes/get-all-color");
    
    if (response.status !== STATUS_OK) {
      return createErrorResponse("Lỗi không xác định", response.status);
    }
    if (response.data.total === 0) {
      return createErrorResponse("Không tìm thấy màu nào", STATUS_NOT_FOUND);
    }
    return response.data as GetAllColorResponse; 
  } catch (error) {
    const errorMessage = (error as Error).message || "Lỗi không xác định"; 
    return createErrorResponse(errorMessage, STATUS_INTERNAL_ERROR);
  }
};
