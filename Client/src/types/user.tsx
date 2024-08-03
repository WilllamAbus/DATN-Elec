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
  token: string;
  _id: string;
  name: string;
  email: string;
  profile: any;
  VerifiedEmail: boolean;
  status: string;
  roles: string;
  birthday: string;
  gender: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
