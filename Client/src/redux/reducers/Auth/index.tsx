import { Auth } from "../../types";
import { AuthState, AuthAction } from "../../../types/user";
const initialState = {
  profile: null,
};

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case Auth.AUTH_UPDATE:
      return {
        ...state,
        profile: action.payload?.profile,
      };
    case Auth.REGISTER_SUCCESS:
      return {
        ...state,
        registered: true,
        profile: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
