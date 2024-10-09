import instance from "../../services/axios"; 
import { LinkAccountData, LoginResponse } from '../../types/user';
export const linkAccountAPI = async (
  { email, password, token }: LinkAccountData & { token: string }
): Promise<LoginResponse> => {
  const response = await instance.post(`/auth/link-account`, { 
    email, 
    password,
    token 
  });
  
  return response.data;
};
