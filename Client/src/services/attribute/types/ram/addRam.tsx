export interface Ram {
  name: string;
  description: string;
}

export interface ResponseRam {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  ram?:Ram;
  error?: string;
}