import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import React from "react";
import { connect, Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { AlertProvider } from "./components/AlertProvider";
import ConnectionProvider from "./components/ConnectionProvider";
import { IntervalProvider } from "./components/IntervalProvider";
import NewContainer from "./layout/Container";
import { persistor, store } from "./Store";

//hoi

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });
}

const _RootContainer = (props) => {
  // NB: we got screenProps here , but not navigation
  // if you also need navigation, use withLayout/Layout

  return (
    <IntervalProvider screenProps={props}>
      <ActionSheetProvider>
        <ConnectionProvider>
          <AlertProvider>
            <NewContainer screenProps={props} />
          </AlertProvider>
        </ConnectionProvider>
      </ActionSheetProvider>
    </IntervalProvider>
  );
};

const mapStateToProps = ({
  device,
  me,
  streetraces,
  ocs,
  cities,
  robberies,
  channels,
  areas,
}) => {
  //console.log("State gets mapped to props... device only");
  return { device, me, streetraces, ocs, cities, robberies, channels, areas };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  reloadMe: (loginToken) => {
    // console.log("reloadMe with loginToken", loginToken);
    dispatch({ type: "ME_FETCH_REQUESTED", payload: { loginToken } });
  },
  reloadStreetraces: () =>
    dispatch({ type: "STREETRACES_FETCH_REQUESTED", payload: null }),
  reloadRobberies: () =>
    dispatch({ type: "ROBBERIES_FETCH_REQUESTED", payload: null }),
  reloadOcs: (token) =>
    dispatch({ type: "OCS_FETCH_REQUESTED", payload: { token } }),
  reloadCities: () =>
    dispatch({ type: "CITIES_FETCH_REQUESTED", payload: null }),
  reloadChannels: (token) =>
    dispatch({ type: "CHANNELS_FETCH_REQUESTED", payload: { token } }),
  reloadAreas: (city) =>
    dispatch({ type: "AREAS_FETCH_REQUESTED", payload: { city } }),
});

const RootContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(_RootContainer);

const App = () => {
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <RootContainer />
      </Provider>
    </PersistGate>
  );
};
export default App;
