export interface Screen {
  _id: string;
  name: string;
  status: string;
  description:string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  deletedAt?: string | null;
}
export interface GetOneScreenResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  screen?: Screen;
}