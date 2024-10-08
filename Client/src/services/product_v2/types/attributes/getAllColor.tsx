
export const STATUS_OK = 200;
export const STATUS_NOT_FOUND = 404;
export const STATUS_INTERNAL_ERROR = 500;

export interface Color {
  _id: string;
  name: string;
  code:string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  hex: string;
}

export interface GetAllColorResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  total: number;
  colors: Color[];
  error?: string;
}

export const createErrorResponse = (message: string, status: number) => {
  return {
    success: false,
    err: 1,
    msg: message,
    status: status,
    total: 0,
    colors: [],
    error: "Có lỗi xảy ra",
  };
};
export interface ColorState {
  colors: Color[];
  status: "idle" | "loading" | "success" | "fail"; 
  error: string | null;
  isLoading: boolean;
}


export const initialColorState: ColorState = {
  colors: [],
  status: "idle",
  error: null,
  isLoading: false,
};
