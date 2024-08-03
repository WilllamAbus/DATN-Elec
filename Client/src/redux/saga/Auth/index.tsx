import { all, call, put, takeLatest } from "redux-saga/effects";
import { Auth } from "../../types";
import { getProfile } from "../../../services/authentication/auth.services";
import { UserProfile } from "../../../types/user";
function* authWatch() {
  yield all([takeLatest(Auth.USE_INFO, getUserInfo)]);
}
function* getUserInfo() {
  // const res = yield getProfile();
  const res: UserProfile = yield call(getProfile);
  yield put({
    type: Auth.AUTH_UPDATE,
    payload: {
      profile: res,
    },
  });
}

export default authWatch;
