export interface NavItem { 
  _id: string;
  name: string;
  status: string;
  slug: string; 
}


export interface ListNavItemResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  navItems: NavItem[]; 
}
