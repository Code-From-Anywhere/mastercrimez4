import ExpoConstants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import React, { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";
import Constants from "../Constants";

async function registerForPushNotificationsAsync() {
  let token;

  if (ExpoConstants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const NotificationsScreen = ({ navigation, screenProps }) => {
  const {
    dispatch,
    me,
    device,
    device: { theme },
    reloadMe,
  } = screenProps;

  const [response, setResponse] = useState("");

  const [pushtoken, setExpoPushToken] = useState("");

  const [notificationsOn, setNotificationsOn] = useState(!!me.pushtoken);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    return () => {};
  }, []);

  const save = (notificationsOn) => {
    const newPushtoken = notificationsOn ? pushtoken : "";

    setNotificationsOn(notificationsOn);

    fetch(`${Constants.SERVER_ADDR}/updateProfile`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pushtoken: newPushtoken,
        loginToken: device.loginToken,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responseJson", responseJson);

        reloadMe(device.loginToken);
        setResponse(responseJson.response);

        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          margin: 20,
          padding: 20,
          borderRadius: 20,
        }}
      >
        {response ? (
          <Text style={{ color: theme.primaryText }}>{response}</Text>
        ) : null}

        <View
          style={{
            padding: 10,
          }}
        >
          <Text style={{ color: theme.primaryText }}>Notificaties aan</Text>

          <Switch
            value={notificationsOn}
            onValueChange={() => save(!me.pushtoken)}
          />
        </View>
      </View>
    </View>
  );
};

export default NotificationsScreen;
