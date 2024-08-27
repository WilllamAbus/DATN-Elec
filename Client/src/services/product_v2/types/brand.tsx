export interface Brand {
  _id: string;
  name: string;
  image?: string;
  category_id: string;
  supplier_id: string;
  description?: string;

}
export interface SelectBrandResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  selectbrand: Brand[];
}