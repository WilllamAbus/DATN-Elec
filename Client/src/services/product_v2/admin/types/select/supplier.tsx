
export interface Supplier {
  _id: string;
  name: string;
}
export interface SelectSupplierResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  selectSuppliers: Supplier[];
}
