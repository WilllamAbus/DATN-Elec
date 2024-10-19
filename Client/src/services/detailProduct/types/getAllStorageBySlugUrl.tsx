
export interface StorageItem {
  _id: string;
  name: string;
  slug: string;
}

export interface GetAllStorageBySlugUrlResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: StorageItem[];
}
