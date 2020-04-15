import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import Api from "./Api";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchMe(action) {
  try {
    const me = yield call(Api.fetchMe, action.payload);

    yield put({ type: "ME_FETCH_SUCCEEDED", me });
  } catch (e) {
    yield put({ type: "ME_FETCH_FAILED", message: e.message });
  }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* mySaga() {
  yield takeLatest("ME_FETCH_REQUESTED", fetchMe);
}

export default mySaga;
