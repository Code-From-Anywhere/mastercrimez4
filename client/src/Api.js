import Constants from "./Constants";
import { get } from "./Util";

const fetchStreetraces = (payload) => {
  return get("streetraces");
};

const fetchRobberies = (payload) => {
  return get("robberies");
};

const fetchOcs = (payload) => {
  return get(`ocs?token=${payload.token}`);
};

const fetchCities = (payload) => {
  return get("cities");
};

const fetchMe = (payload) => {
  const url = `${Constants.SERVER_ADDR}/me?token=${payload.loginToken}`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (me) => {
      return me;
    })
    .catch((error) => {
      console.error(error);
    });
};

const Api = {
  fetchMe,
  fetchCities,
  fetchStreetraces,
  fetchOcs,
  fetchRobberies,
};
export default Api;
