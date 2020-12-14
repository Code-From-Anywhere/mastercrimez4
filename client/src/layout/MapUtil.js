import moment from "moment";
import { Platform } from "react-native";
export const API_KEY = "AIzaSyCOENphOkWqcrvmehHhhgKu7lJpwqfLQzc";

export const OBJECT_SIZE_FACTOR = 4;
export const SIZE_FACTOR = 100;

export const objects = [
  {
    title: "menuHouse",
    type: "house",
    image: require("../../assets/map/house2.png"),
    size: 10,
    aspectRatio: 783 / 500,
  },

  {
    title: "menuHeadquarter",
    type: "headquarter",
    image: require("../../assets/map/headquarter.png"),
    size: 10,
    aspectRatio: 202 / 182,
  },

  {
    title: "menuBulletfactory",
    type: "bulletFactory",
    image: require("../../assets/map/bulletfactory.png"),
    size: 10,
    aspectRatio: 1,
  },
  {
    title: "menuAirport",
    type: "airport",
    image: require("../../assets/map/airport.png"),
    size: 15,
    aspectRatio: 1,
  },

  {
    title: "menuBank",
    type: "bank",
    image: require("../../assets/map/bank.png"),
    size: 8,
    aspectRatio: 200 / 235,
  },

  {
    title: "menuCasino",
    type: "casino",
    image: require("../../assets/map/casino.png"),
    size: 20,
    aspectRatio: 400 / 251,
  },

  {
    title: "menuCoffeeShop",
    type: "landlord",
    image: require("../../assets/map/coffeeshop.png"),
    size: 10,
    aspectRatio: 300 / 270,
  },

  {
    title: "menuSalvationArmy",
    type: "junkies",
    image: require("../../assets/map/junkies.png"),
    size: 10,
    aspectRatio: 1,
  },

  {
    title: "menuGarage",
    type: "garage",
    image: require("../../assets/map/garage.png"),
    size: 10,
    aspectRatio: 400 / 292,
  },

  {
    title: "menuGym",
    type: "gym",
    to: "Gym",
    image: require("../../assets/map/gym.png"),
    size: 10,
    aspectRatio: 300 / 231,
  },

  {
    title: "menuHospital",
    type: "hospital",
    to: "Hospital",
    image: require("../../assets/map/hospital.png"),
    size: 10,
    aspectRatio: 300 / 270,
  },

  {
    title: "menuJail2",
    type: "jail",
    to: "Jail",
    image: require("../../assets/map/jail.png"),
    size: 10,
    aspectRatio: 1,
  },

  {
    title: "menuMarket",
    type: "market",
    to: "Market",
    image: require("../../assets/map/market.png"),
    size: 10,
    aspectRatio: 1,
  },
  {
    title: "menuWeaponShop",
    type: "weaponShop",
    image: require("../../assets/map/shop.png"),
    size: 10,
    aspectRatio: 300 / 262,
  },

  {
    title: "menuEstateAgent",
    type: "estateAgent",
    to: "EstateAgent",
    image: require("../../assets/map/shop.png"),
    size: 10,
    aspectRatio: 300 / 262,
  },

  {
    title: "menuRLD",
    type: "rld",
    image: require("../../assets/map/sexshop.png"),
    size: 10,
    aspectRatio: 1,
  },

  {
    title: "menuStockExchange",
    type: "stockExchange",
    to: "StockExchange",
    image: require("../../assets/map/market.png"),
    size: 10,
    aspectRatio: 1,
  },
];

export const selectBuilding = ({
  type,
  city,
  cityAreas,
  map,
  setZoom,
  setView,
  setSelected,
  animate,
  device,
  dispatch,
  getText,
}) => {
  const objectIndex = objects.findIndex((x) => x.type === type);
  const object = objects[objectIndex];

  console.log("hasseeninfo", device.hasSeenInfo);
  if (!device.hasSeenInfo[`${type}Building`]) {
    dispatch({
      type: "SET_GUY_TEXT",
      setHasSeenInfo: `${type}Building`,
      value: getText(`${type}BuildingInfo`),
    });
  }

  if (animate) {
    const {
      latitude,
      longitude,
      zoom,
      deltaLatitude,
      deltaLongitude,
    } = getObjectMeta({
      city,
      cityAreas,
      index: objectIndex,
      object,
    });

    if (latitude && longitude) {
      if (Platform.OS === "web") {
        map.panTo({
          lat: latitude,
          lng: longitude,
        });

        setZoom(zoom - 2);
      } else {
        map.animateToRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: deltaLatitude,
          longitudeDelta: deltaLongitude,
        });
      }
    }
  }

  setView("game");
  setSelected(type);
};
export const rgbs = [
  "0,255,0",
  "255,0,0",
  "0,255,255",
  "0,0,255",
  "255,0,255",
  "255,255,0",
  "0,150,0",
  "0,0,150",
];

const decimalHash = (string) => {
  let sum = 0;
  for (let i = 0; i < string.length; i++)
    sum += ((i + 1) * string.codePointAt(i)) / (1 << 8);
  return sum % 1;
};

// kies positiegetal deterministisch aan de hand van een string van moment().format("DD-MM-YY HH") en index en type
export const getPosition = (id, type) => {
  const string = moment().format("DD-MM-YY HH") + id?.toString() + type;
  return decimalHash(string);
};

export const getZoom = (delta) => Math.ceil(Math.log(360 / delta) / Math.LN2);

export const DEFAULT_CITY = {
  latitude: 52.378, //amsterdam
  longitude: 4.89707,
  delta: 0.3,
};

export const animateToCity = ({
  map,
  dispatch,
  city,
  delayZoom,
  zoom,
  animationTime,
}) => {
  if (Platform.OS === "web") {
    const zoom2 = zoom ? zoom : getZoom(city?.delta || DEFAULT_CITY.delta);
    console.log("animateTocity", zoom2);

    const doZoom = () => dispatch({ type: "SET_ZOOM", value: zoom2 });

    if (delayZoom) {
      setTimeout(() => doZoom(), 2000);
    } else {
      doZoom();
    }
    map?.panTo({
      lat: city?.latitude || DEFAULT_CITY.latitude,
      lng: city?.longitude || DEFAULT_CITY.longitude,
    });
  } else {
    map?.animateToRegion(
      {
        latitude: city?.latitude || DEFAULT_CITY.latitude,
        longitude: city?.longitude || DEFAULT_CITY.longitude,
        latitudeDelta: city?.delta || DEFAULT_CITY.delta * 1.2,
        longitudeDelta: city?.delta || DEFAULT_CITY.delta * 1.2,
      },
      animationTime
    );
  }
};

export const animateToWorld = ({ map, dispatch, city }) => {
  if (Platform.OS === "web") {
    const doZoom = () => dispatch({ type: "SET_ZOOM", value: 3 });

    doZoom();

    map?.panTo({
      lat: city.latitude,
      lng: city.longitude,
    });
  } else {
    map?.animateToRegion({
      latitude: city.latitude,
      longitude: city.longitude,
      latitudeDelta: 100,
      longitudeDelta: 100,
    });
  }
};

export const shouldRenderCities = (device, region) =>
  Platform.OS === "web" ? device.map.zoom < 5 : region.latitudeDelta > 3;
export const getObjectMeta = ({ object, index, city, cityAreas }) => {
  let latitude = city?.[`${object.type}Latitude`];
  let longitude = city?.[`${object.type}Longitude`];

  if (!latitude || !longitude) {
    const terri = cityAreas.areas[index % (cityAreas.areas.length - 1)];
    latitude = terri.centerLatitude;
    longitude = terri.centerLongitude;
  }

  const deltaLatitude =
    (city?.delta * object.size) / object.aspectRatio / SIZE_FACTOR; //width
  const deltaLongitude = (city?.delta * object.size) / SIZE_FACTOR;

  const biggestDeltaLatitude =
    deltaLatitude > deltaLongitude ? deltaLatitude : deltaLongitude;
  const topLeftLatitude = latitude - deltaLatitude / 2;
  const topLeftLongitude = longitude - deltaLongitude / 2;
  const bottomRightLatitude = latitude + deltaLatitude / 2;
  const bottomRightLongitude = longitude + deltaLongitude / 2;

  const topRightLatitude = latitude + deltaLatitude / 2;
  const topRightLongitude = longitude - deltaLongitude / 2;
  const bottomLeftLatitude = latitude - deltaLatitude / 2;
  const bottomLeftLongitude = longitude + deltaLongitude / 2;

  const square = [
    { latitude: topLeftLatitude, longitude: topLeftLongitude },
    { latitude: topRightLatitude, longitude: topRightLongitude },
    {
      latitude: bottomRightLatitude,
      longitude: bottomRightLongitude,
    },
    { latitude: bottomLeftLatitude, longitude: bottomLeftLongitude },
  ];

  const bounds = {
    east: bottomRightLongitude,
    south: bottomLeftLatitude,
    north: bottomRightLatitude,
    west: topRightLongitude,
  };

  const platformBounds =
    Platform.OS === "ios"
      ? [
          [topLeftLatitude, topLeftLongitude],
          [bottomRightLatitude, bottomRightLongitude],
        ]
      : [
          [bottomRightLatitude, topLeftLongitude],
          [topLeftLatitude, bottomRightLongitude],
        ];

  const radius = biggestDeltaLatitude * 50000;

  const zoom = getZoom(biggestDeltaLatitude);
  return {
    latitude,
    longitude,
    deltaLatitude,
    deltaLongitude,
    biggestDeltaLatitude,
    radius,
    zoom,
    square,
    bounds,
    platformBounds,
  };
};
