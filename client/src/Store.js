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
};

const deviceReducer = (state: Device = initDevice, action) => {
  switch (action.type) {
    case "PURGE": {
      return initDevice;
    }

    case "SET_IS_CONNECTED": {
      return { ...state, isConnected: action.value };
    }

    case "SET_LOGIN_TOKEN": {
      return { ...initDevice, loginToken: action.value };
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
  whitelist: ["device", "me", "streetraces", "cities"],
};

const sagaMiddleware = createSagaMiddleware();

const reducers = {
  device: deviceReducer,
  me: meReducer,
  cities: citiesReducer,
  streetraces: streetracesReducer,
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
