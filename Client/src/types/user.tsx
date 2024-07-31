export interface Login {
  email: string;
  password: string;
}

export interface Registe {
  email: string;
  password: string;
  name: string;
}
export interface profile {
  profile: any;
}

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
  _id: string;
  name: string;
  email: string;
  VerifiedEmail: boolean;
  status: string;
  roles: string[];
  birthday?: string;
  gender?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
