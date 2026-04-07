import instance from "../../axios";
import { 
  GetAllRamResponse, 
  STATUS_OK, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_ERROR, 
  createErrorResponse 
} from "../types/attributes/getAllRam";
export const getAllRam = async (): Promise<GetAllRamResponse> => {
  try {
    const response = await instance.get<GetAllRamResponse>("/attributes/get-all-ram");
    
    if (response.status !== STATUS_OK) {
      return createErrorResponse("Lỗi không xác định", response.status);
    }
    if (response.data.total === 0) {
      return createErrorResponse("Không tìm thấy RAM nào", STATUS_NOT_FOUND);
    }
    return response.data as GetAllRamResponse; 
  } catch (error) {
    const errorMessage = (error as Error).message || "Lỗi không xác định"; 
    return createErrorResponse(errorMessage, STATUS_INTERNAL_ERROR);
  }
};