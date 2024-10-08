import instance from "../../axios";
import { 
  GetAllOperatingSystemResponse, 
  STATUS_OK, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_ERROR, 
  createErrorResponse 
} from "../types/attributes/getAllOperatingSystem";

export const getAllOperatingSystem = async (): Promise<GetAllOperatingSystemResponse> => {
  try {
    const response = await instance.get<GetAllOperatingSystemResponse>("/attributes/get-all-operating-system");

    if (response.status !== STATUS_OK) {
      return createErrorResponse("Lỗi không xác định", response.status);
    }
    if (response.data.total === 0) {
      return createErrorResponse("Không tìm thấy hệ điều hành nào", STATUS_NOT_FOUND);
    }
    return response.data as GetAllOperatingSystemResponse; 
  } catch (error) {
    const errorMessage = (error as Error).message || "Lỗi không xác định"; 
    return createErrorResponse(errorMessage, STATUS_INTERNAL_ERROR);
  }
};
