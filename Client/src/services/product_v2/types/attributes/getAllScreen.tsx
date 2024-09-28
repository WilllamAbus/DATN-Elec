export const STATUS_OK = 200;
export const STATUS_NOT_FOUND = 404;
export const STATUS_INTERNAL_ERROR = 500;

export interface Screen {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface GetAllScreenResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  total: number;
  screens: Screen[]; 
  error?: string;
}

export const createErrorResponse = (message: string, status: number) => {
  return {
    success: false,
    err: 1,
    msg: message,
    status: status,
    total: 0,
    screens: [], 
    error: "Có lỗi xảy ra",
  };
};

export interface ScreenState {
  screens: Screen[];
  status: "idle" | "loading" | "success" | "fail"; 
  error: string | null;
  isLoading: boolean;
}

export const initialScreenState: ScreenState = {
  screens: [],
  status: "idle",
  error: null,
  isLoading: false,
};
