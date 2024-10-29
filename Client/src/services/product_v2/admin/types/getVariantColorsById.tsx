export interface GetVariantColorsByIdResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: Color[];
}

export interface Color {
  _id: string;
  name: string;
  code: string;
}
