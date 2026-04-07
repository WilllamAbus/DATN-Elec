export interface Login {
  email: string;
  password: string;
}

export interface Registe {
  email: string;
  password: string;
  name: string;
}
// export interface profile {
//   roles: string;
//   name: string
//   profile: any;
// }

export interface AuthState {
  profile: any | null;
  registered?: boolean;
}

export interface AuthAction {
  type: string;
  payload?: {
    profile?: any;
  };
}
export interface UserProfile {
  profile?: string;
  msg?: string;
  token?: string;
  _id: string;
  id?: string;
  name: string;
  accessToken: string;
  email: string;
  VerifiedEmail: string;
  status: string | null;
  message: string | null;
  refreshToken: string;
  roles: string[];
  birthday: string;
  gender: string;
  password?: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  banks: Bank[];
  createdAt: string;
  updatedAt?: string;
  currentUser: string;
  redirectTo: string;
}
export interface Userpagi {
  profile?: string;
  msg?: string;
  token?: string;
  _id: string;
  id?: string;
  name: string;
  accessToken: string;
  email: string;
  VerifiedEmail: string;
  status: string | null;
  message: string | null;
  refreshToken: string;
  roles: Role[];
  birthday: string;
  gender: string;
  password?: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  banks: Bank[];
  createdAt: string;
  updatedAt?: string;
  currentUser: string;
  redirectTo: string;
}

// Định nghĩa interface Address cho cấu trúc địa chỉ
// export interface Address {
//   name: string;
//   address: string;
//   addressID: string;
//   phone: string;
// }
export interface Address {
  addressId?: string;
  _id?: string;
  fullName?: string; // fullName có thể không có (optional)
  address: string;
  addressID: string; // ID địa chỉ (JSON string)
  phone: string;
  isDefault?: boolean;
}
export interface Bank {
  _id?: string;
  id?: number;
  name: string;
  fullName: string;
  accountNumber: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  support: number;
  isTransfer: boolean;
  swift_code: string;
  isDefault?: boolean;
}

export interface AddressResponse {
  message: string; // Thông điệp từ API
  addresses: Address[]; // Mảng các địa chỉ
}
export interface BankResponse {
  message: string; // Thông điệp từ API
  banks: Bank[]; // Mảng các địa chỉ
}

export interface ErrorResponse {
  status: number;
  message: string;
}
export interface SoftDeleteResponse {
  message: string;
}
export interface ForgotState {
  status: number | null;
  message: string | null;
  loading: boolean;
  error: string | null;
}
export interface ResetPassState {
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string;
  error: string | null;
}
export interface UpdateUser {
  _id: string;
  name: string;
  roles: Role[];
  birthday: string;
  gender: string;
  phone: string;
  avatar: string;
  address: string;
  addressID: string;
}
export interface Permission {
  name: string;
  resources: string[];
}

export interface Role {
  _id: string;
  // roleId: string;
  name: string;
  // permissions: Permission[];
}
export interface LoginResponse {
  status: number;
  message: string;
  email: string;
  googleId: string;
  roles: Role[];
  currentUser: string;
  token?: string;
  userProfile: UserProfile;
  accessToken: string;
  refreshToken: string;
  redirectTo: string;
}

export interface LinkAccountData {
  email: string;
  password: string;
  token: string;
}
export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LimitCrudUserResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    users: Userpagi[];
  };
  pagination: Pagination;
}
