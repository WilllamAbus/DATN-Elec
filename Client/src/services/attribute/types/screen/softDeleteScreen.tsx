
export interface Screen {
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


export interface SoftDeleteScreenResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: Screen;
}
