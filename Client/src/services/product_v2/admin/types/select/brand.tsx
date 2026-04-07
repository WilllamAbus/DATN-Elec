export interface Brand {
  _id: string;
  name: string;
}
export interface SelectBrandResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  selectbrand: Brand[];
}