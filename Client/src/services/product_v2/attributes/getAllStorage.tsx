import instance from "../../axios";
import { 
  GetAllStorageResponse, 
  STATUS_OK, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_ERROR, 
  createErrorResponse 
} from "../types/attributes/getAllStorage";

export const getAllStorage = async (): Promise<GetAllStorageResponse> => {
  try {
    const response = await instance.get<GetAllStorageResponse>("/attributes/get-all-storage");

    if (response.status !== STATUS_OK) {
      return createErrorResponse("Lỗi không xác định", response.status);
    }
    if (response.data.total === 0) {
      return createErrorResponse("Không tìm thấy bộ nhớ nào", STATUS_NOT_FOUND);
    }
    return response.data as GetAllStorageResponse; 
  } catch (error) {
    const errorMessage = (error as Error).message || "Lỗi không xác định"; 
    return createErrorResponse(errorMessage, STATUS_INTERNAL_ERROR);
  }
};
