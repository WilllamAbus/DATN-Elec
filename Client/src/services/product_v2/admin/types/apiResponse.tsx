export interface ApiResponse<T> {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  product?: T;
  error?: string;
}
