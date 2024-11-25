export interface Screen {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ResponseScreen {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
     total: number;
     screens: Screen[];
     countOnPage: number;
  };
  pagination: Pagination;
}
