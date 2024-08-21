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
  name: string;
  accessToken: string;
  email: string;
  VerifiedEmail: string;
  status: string;
  refreshToken: string;
  roles: string[];
  birthday: string;
  gender: string;
  phone: string;
  avatar: string;
  address: string;
  createdAt: string;
  updatedAt?: string;
}
export interface ForgotState {
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string;
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
  roles: string[];
  birthday: string;
  gender: string;
  phone: string;
  avatar: string;
  address: string;
}
export interface Role {
  _id: string;
  name: string;
}
export interface LoginResponse {
  status: number;
  message: string;
  token?: string;
  userProfile: UserProfile;
  accessToken: string;
  refreshToken: string;
}
