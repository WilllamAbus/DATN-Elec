import request from "../../redux/auth/apiRequest";
import { Login, Register } from "../../types/user";

const loginApi = async ({ email, password }: Login) => {
  const res = await request({
    path: "/auth/login",
    method: "POST",
    data: {
      email: email,
      password: password,
      device: "website",
    },
  });

  return res;
};

const getProfile = async () => {
  const res = await request({ path: "/user" });

  return res;
};
const registerApi = async ({ email, password, name }: Register) => {
  const res = await request({
    path: "/auth/register",
    method: "POST",
    data: {
      email: email,
      password: password,
      name: name,
      device: "website",
    },
  });

  return res;
};
export { loginApi, getProfile, registerApi };
