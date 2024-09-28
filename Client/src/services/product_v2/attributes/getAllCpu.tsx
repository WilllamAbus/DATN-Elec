import instance from "../../axios";
import { 
  GetAllCpuResponse, 
  STATUS_OK, 
  STATUS_NOT_FOUND, 
  STATUS_INTERNAL_ERROR, 
  createErrorResponse 
} from "../types/attributes/getAllCpu";

export const getAllCpu = async (): Promise<GetAllCpuResponse> => {
  try {
    const response = await instance.get<GetAllCpuResponse>("/attributes/get-all-cpu");

    if (response.status !== STATUS_OK) {
      return createErrorResponse("Lỗi không xác định", response.status);
    }
    if (response.data.total === 0) {
      return createErrorResponse("Không tìm thấy CPU nào", STATUS_NOT_FOUND);
    }
    return response.data as GetAllCpuResponse; 
  } catch (error) {
    const errorMessage = (error as Error).message || "Lỗi không xác định"; 
    return createErrorResponse(errorMessage, STATUS_INTERNAL_ERROR);
  }
};
