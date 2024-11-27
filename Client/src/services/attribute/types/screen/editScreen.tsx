export interface Screen {
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

export interface ResponseScreen {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  screen?: Screen;
  error?: string;
}
