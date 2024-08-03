import { all } from "redux-saga/effects";

import authWatch from "./Auth";

function* middleware() {
  yield all([authWatch()]);
}

export default middleware;
