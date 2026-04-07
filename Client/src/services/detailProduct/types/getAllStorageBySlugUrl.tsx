
export interface STORAGE {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface GetAllStorageBySlugUrlResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: STORAGE[];
}
