import { combineReducers } from "redux";

import authReducer from "./Auth";

const result = combineReducers({
  authReducer,
});

export default result;
