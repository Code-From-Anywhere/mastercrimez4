import { AsyncStorage } from "react-native";
import { applyMiddleware, compose, createStore } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import mySaga from "./Sagas";
import { DEFAULT_THEME, Theme } from "./screens/Theme";

type Movement = {
  action: string,
  locationX: number,
  locationY: number,
  timestamp: number,
};
type Device = {
  loginToken: string,
  logged: boolean,
  theme: Theme,
  foregrounded: number,
  movements: Movement[],
};

const initDevice = {
  loginToken: "",
  logged: false,
  theme: DEFAULT_THEME,
  isConnected: 2,
  foregrounded: 0,
  movements: [],
  menu: {
    left: [0, 1, 2, 3, 4, 5, 6],
    right: [0, 1, 2, 3, 4, 5, 6],
  },
};

const deviceReducer = (state: Device = initDevice, action) => {
  switch (action.type) {
    case "PURGE": {
      return initDevice;
    }

    case "MENU_SET_RIGHT_ACTIVE_SECTIONS": {
      return { ...state, menu: { left: state.menu.left, right: action.value } };
    }
    case "MENU_SET_LEFT_ACTIVE_SECTIONS": {
      return {
        ...state,
        menu: { right: state.menu.right, left: action.value },
      };
    }

    case "SET_IS_CONNECTED": {
      return { ...state, isConnected: action.value };
    }

    case "SET_LOGIN_TOKEN": {
      return { ...initDevice, loginToken: action.value };
    }

    case "SET_LOGIN_TOKEN_AND_LOGIN": {
      return { ...initDevice, loginToken: action.value, logged: true };
    }

    case "SET_LOGGED": {
      return { ...state, logged: action.value };
    }

    case "SET_THEME": {
      return { ...state, theme: action.value };
    }

    case "ADD_MOVEMENT": {
      return { ...state, movements: state.movements.concat([action.value]) };
    }

    case "CLEAR_MOVEMENTS": {
      return { ...state, movements: [] };
    }

    case "INCREASE_FOREGROUNDED": {
      return { ...state, foregrounded: state.foregrounded + 1 };
    }

    default:
      return state;
  }
};

const initMe = null;
const meReducer = (state = initMe, action) => {
  switch (action.type) {
    case "PURGE": {
      return initMe;
    }

    case "ME_FETCH_SUCCEEDED": {
      return action.me;
    }

    case "ME_FETCH_FAILED": {
      return state;
    }
    default:
      return state;
  }
};

const initStreetraces = null;
const streetracesReducer = (state = initStreetraces, action) => {
  switch (action.type) {
    case "PURGE": {
      return initStreetraces;
    }

    case "STREETRACES_FETCH_SUCCEEDED": {
      return action.streetraces;
    }

    case "STREETRACES_FETCH_FAILED": {
      return state;
    }
    default:
      return state;
  }
};

const initOcs = null;
const ocsReducer = (state = initOcs, action) => {
  switch (action.type) {
    case "PURGE": {
      return initOcs;
    }

    case "OCS_FETCH_SUCCEEDED": {
      return action.ocs;
    }

    case "OCS_FETCH_FAILED": {
      return state;
    }
    default:
      return state;
  }
};

const initCities = null;
const citiesReducer = (state = initCities, action) => {
  switch (action.type) {
    case "PURGE": {
      return initCities;
    }
    case "CITIES_FETCH_SUCCEEDED": {
      return action.cities;
    }
    case "CITIES_FETCH_FAILED": {
      return state;
    }
    default:
      return state;
  }
};

const config = {
  key: "v1",
  storage: AsyncStorage,
  whitelist: ["device", "me", "streetraces", "cities", "ocs"],
};

const sagaMiddleware = createSagaMiddleware();

const reducers = {
  device: deviceReducer,
  me: meReducer,
  cities: citiesReducer,
  streetraces: streetracesReducer,
  ocs: ocsReducer,
};

const rootReducer = persistCombineReducers(config, reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
const persistor = persistStore(store);

sagaMiddleware.run(mySaga);

export { persistor, store };
