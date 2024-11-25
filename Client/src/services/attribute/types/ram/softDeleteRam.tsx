export interface Ram {
  _id: string;
  name: string;
  status: "active" | "disabled";
  sku: string;
  pid: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  deletedAt: string | null;
}

export interface SoftDeleteRamResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: Ram;
}