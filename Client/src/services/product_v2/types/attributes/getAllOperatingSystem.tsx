export const STATUS_OK = 200;
export const STATUS_NOT_FOUND = 404;
export const STATUS_INTERNAL_ERROR = 500;

export interface OperatingSystem {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface GetAllOperatingSystemResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  total: number;
  operatingSystems: OperatingSystem[]; 
  error?: string;
}

export const createErrorResponse = (message: string, status: number) => {
  return {
    success: false,
    err: 1,
    msg: message,
    status: status,
    total: 0,
    operatingSystems: [], 
    error: "Có lỗi xảy ra",
  };
};

export interface OperatingSystemState {
  operatingSystems: OperatingSystem[];
  status: "idle" | "loading" | "success" | "fail"; 
  error: string | null;
  isLoading: boolean;
}

export const initialOperatingSystemState: OperatingSystemState = {
  operatingSystems: [],
  status: "idle",
  error: null,
  isLoading: false,
};
