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

const fetchChannels = (payload) => {
  return get(`channelsubs?loginToken=${payload.token}`);
};

const fetchAreas = (payload) => {
  return get(`areas?city=${payload.city}`);
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
      // console.log("got me", me);
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
  fetchAreas,
  fetchChannels,
};
export default Api;
