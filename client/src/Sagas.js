import { call, put, takeLatest } from "redux-saga/effects";
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

function* fetchStreetraces(action) {
  try {
    const { streetraces } = yield call(Api.fetchStreetraces, action.payload);

    yield put({ type: "STREETRACES_FETCH_SUCCEEDED", streetraces });
  } catch (e) {
    yield put({ type: "STREETRACES_FETCH_FAILED", message: e.message });
  }
}

function* fetchRobberies(action) {
  try {
    const { robberies } = yield call(Api.fetchRobberies, action.payload);

    yield put({ type: "ROBBERIES_FETCH_SUCCEEDED", robberies });
  } catch (e) {
    yield put({ type: "ROBBERIES_FETCH_FAILED", message: e.message });
  }
}

function* fetchOcs(action) {
  try {
    const { ocs } = yield call(Api.fetchOcs, action.payload);

    yield put({ type: "OCS_FETCH_SUCCEEDED", ocs });
  } catch (e) {
    yield put({ type: "OCS_FETCH_FAILED", message: e.message });
  }
}

function* fetchCities(action) {
  try {
    const { cities } = yield call(Api.fetchCities, action.payload);

    yield put({ type: "CITIES_FETCH_SUCCEEDED", cities });
  } catch (e) {
    yield put({ type: "CITIES_FETCH_FAILED", message: e.message });
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
  yield takeLatest("CITIES_FETCH_REQUESTED", fetchCities);
  yield takeLatest("STREETRACES_FETCH_REQUESTED", fetchStreetraces);
  yield takeLatest("OCS_FETCH_REQUESTED", fetchOcs);
  yield takeLatest("ROBBERIES_FETCH_REQUESTED", fetchRobberies);
}

export default mySaga;
