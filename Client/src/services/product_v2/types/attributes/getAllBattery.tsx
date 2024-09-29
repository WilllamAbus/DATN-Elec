export const STATUS_OK = 200;
export const STATUS_NOT_FOUND = 404;
export const STATUS_INTERNAL_ERROR = 500;

export interface Battery {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface GetAllBatteryResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  total: number;
  batteries: Battery[]; 
  error?: string;
}

export const createErrorResponse = (message: string, status: number) => {
  return {
    success: false,
    err: 1,
    msg: message,
    status: status,
    total: 0,
    batteries: [], 
    error: "Có lỗi xảy ra",
  };
};

export interface BatteryState {
  batteries: Battery[];
  status: "idle" | "loading" | "success" | "fail"; 
  error: string | null;
  isLoading: boolean;
}

export const initialBatteryState: BatteryState = {
  batteries: [],
  status: "idle",
  error: null,
  isLoading: false,
};
