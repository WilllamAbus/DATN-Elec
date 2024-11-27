export interface Ram {
  _id: string;
  name: string;
  description: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  deletedAt?: string | null;
}

export interface ResponseRam {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  ram?: Ram;
  error?: string;
}