import React, { useMemo, useState } from "react";
import isEqual from "react-fast-compare";
import { Linking, Platform } from "react-native";
import { doOnce } from "../Util";
import Map from "./Map";
import { screens } from "./Screen";

const initialNavigationState = {
  params: null,
  routeName: null,
  history: [],
};
const Container = React.memo(function ContainerPure({ screenProps }) {
  const [navigationState, setNavigationState] = useState(
    initialNavigationState
  );
  doOnce(() => {
    Linking.addEventListener("url", openWebUrl);
    Linking.getInitialURL().then((url) => openWebUrl(url));
  });
  const openWebUrl = (url) => {
    if (Platform.OS === "web") {
      const parts = url?.split("://")[1].split("/");
      //parts is now ["masercrimez.com","#","Junkies","param"]
      const routeName = parts[2];
      const params = parts[3] ? { param: parts[3] } : undefined;

      if (Object.keys(screens).includes(routeName)) {
        setNavigationState({
          history: [{ routeName, params }],
          routeName,
          params,
        });
      }
    }
  };

  const navigation = useMemo(
    () => ({
      navigate: (routeName, params) => {
        const newHistory = navigationState.history.concat([
          { routeName, params },
        ]);
        setNavigationState({ history: newHistory, routeName, params });
        if (Platform.OS === "web") {
          window.history.pushState(routeName, routeName, `/#/${routeName}`);
        }
      },

      resetTo: (routeName, params) => {
        const newHistory = [{ routeName, params }];
        setNavigationState({ history: newHistory, routeName, params });
        if (Platform.OS === "web") {
          window.history.pushState(routeName, routeName, `/#/${routeName}`);
        }
      },

      state: navigationState,
      popToTop: () => {
        setNavigationState(initialNavigationState);
        if (Platform.OS === "web") {
          window.history.pushState("home", "Home", "/#/");
        }
      },
      goBack: () => {
        navigationState.history.pop();
        setNavigationState({
          history: navigationState.history,
          ...(navigationState.history.length > 0
            ? navigationState.history[navigationState.history.length - 1]
            : {}),
        });
      },
    }),
    [navigationState, setNavigationState]
  );

  return <Map navigation={navigation} screenProps={screenProps} />;
}, isEqual);

// Container.whyDidYouRender = { logOnDifferentValues: true };
export default Container;
