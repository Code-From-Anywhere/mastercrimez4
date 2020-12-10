import ExpoConstants from "expo-constants";
import * as ExpoNotifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as StoreReview from "expo-store-review";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { AppState, NativeModules, Platform, View } from "react-native";
import { IntervalContext } from "../components/IntervalProvider";
import LoginModal from "../components/LoginModal";
import { doOnce, getTextFunction, post } from "../Util";

const Logic = ({
  children,
  screenProps,
  navigation,
  screenProps: { device, dispatch, me, reloadMe, reloadChannels },
}) => {
  const { resetIntervalsForToken } = React.useContext(IntervalContext);
  const getText = getTextFunction(me?.locale);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    turnOnNotifications();
    sendLanguage();

    return () => AppState.removeEventListener("change", handleAppStateChange);
  }, []);

  useEffect(() => {
    fetchChannelsubs();

    const interval = setInterval(() => fetchChannelsubs(), 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchChannelsubs = () => {
    reloadChannels(device.loginToken);
  };

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      turnOnNotifications();
      sendLanguage();
    }
  };

  const sendLanguage = () => {
    const locale =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : Platform.OS === "android"
        ? NativeModules.I18nManager.localeIdentifier
        : Platform.OS === "web"
        ? navigator.language
        : null;

    // console.log("locale", locale);
    if (locale !== me?.locale) {
      post("updateProfile", {
        locale,
        loginToken: device.loginToken,
      });
    }
  };
  const turnOnNotifications = async () => {
    if (ExpoConstants.isDevice && Platform.OS !== "web") {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        dispatch({ type: "SET_SHOW_NOTIFICATIONS_HEADER", value: true });

        if (me?.pushtoken !== "") {
          post("updateProfile", {
            pushtoken: "",
            loginToken: device.loginToken,
          });
        }

        return;
      }
      const token = (await ExpoNotifications.getExpoPushTokenAsync()).data;
      if (token !== me?.pushtoken) {
        post("updateProfile", {
          pushtoken: token,
          loginToken: device.loginToken,
        });
      }
      dispatch({ type: "SET_SHOW_NOTIFICATIONS_HEADER", value: false });
    }
  };

  doOnce(() => {
    let token = device.loginToken;

    if (!token || token.length < 64) {
      token = makeid(64);
      dispatch({ type: "SET_LOGIN_TOKEN", value: token });

      resetIntervalsForToken(token);
      reloadMe(token);
    } else {
      reloadMe(token);
    }
  });

  useEffect(() => {
    reloadMe(device.loginToken);
  }, [device.logged]);

  const _handleNotificationResponse = ({
    notification: {
      request: {
        content: { data },
      },
    },
  }) => {
    //TODO: Fix dat hij naar chat redirect
    // navigation.navigate("Channels", { id: data.body.id });
  };

  const handleChange = (nextAppState) => {
    if (nextAppState === "active") {
      // somehow this doesn't work properly
      // screenProps.reloadMe(screenProps.device.loginToken);

      dispatch({ type: "INCREASE_FOREGROUNDED" });

      if (device.foregrounded > 3) {
        StoreReview.isAvailableAsync().then((available) => {
          // console.log("avaiable", available);
          if (available) {
            StoreReview.requestReview();
          }
        });
      }
    }
  };

  useEffect(() => {
    ExpoNotifications.addNotificationResponseReceivedListener(
      _handleNotificationResponse
    );
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", handleChange);

    return () => {
      AppState.removeEventListener("change", handleChange);
    };
  }, []);

  const renderForWeb = () => (
    <Helmet>
      <title>MasterCrimeZ - The Ultimate Game</title>
      <meta name="description" content={getText("metaDescription")} />

      <meta property="og:url" content="https://mastercrimez.com/" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={getText("metaOgTitle")} />
      <meta property="og:description" content={getText("metaOgDescription")} />
      <meta property="og:image" content="" />
    </Helmet>
  );
  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === "web" && renderForWeb()}
      {children}

      {!device.logged && (
        <LoginModal navigation={navigation} screenProps={screenProps} />
      )}
    </View>
  );
};

export default Logic;
