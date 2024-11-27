export interface Screen {
  name: string;
  description: string;
}

export interface ResponseScreen {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  screen?: Screen;
  error?: string;
}
