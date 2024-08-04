import { Auth } from "../../types";

// const auth = () => {};

const registerSuccess = (userInfo: any) => {
  return {
    type: Auth.REGISTER_SUCCESS,
    payload: userInfo,
  };
};
const getProfile = () => {
  return {
    type: Auth.USE_INFO,
  };
};
export { registerSuccess, getProfile };
