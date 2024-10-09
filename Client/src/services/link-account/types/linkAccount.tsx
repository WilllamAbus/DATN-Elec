export interface GoogleAuthResponse {
  email: string; 
  googleId: string;
  iat: number;
  exp: number;
}
export interface Permission {
  name: string;
  resources: string[];
}

export interface Role {
  _id: string;
  roleId: string;
  name: string;
  permissions: Permission[];
}
export interface LinkAccountData {
  email: string;
  password: string;
  token: string; 
}

export interface LinkAccountResponse {
  message: string;
  email: string;
  googleId: string;
  accessToken: string; 
  token: string; 
  roles: Role[];
}
