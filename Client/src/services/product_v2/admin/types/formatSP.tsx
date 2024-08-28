
export interface ProductFormat {
  _id: string;
  formats: string;
  status: string;
  disabledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SelectProductFormatResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  productFormats: ProductFormat[];
}
