
export interface Supplier {
  _id: string;
  name: string;
  description?: string;
}
export interface SelectSupplierResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  suppliers: Supplier[];
}
