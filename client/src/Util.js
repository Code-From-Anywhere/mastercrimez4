import ExpoConstants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { useEffect } from "react";
import { Alert, Dimensions, Platform, ScaledSize } from "react-native";
import Constants from "./Constants";

const replaceAll = (string, search, replacement) =>
  string.split(search).join(replacement);

export const getLocale = (userLocale) => {
  const firstPart = userLocale && userLocale.split("-")[0].split("_")[0];

  return firstPart === "nl" ? "nl" : "en";
};
export const getTextFunction = (userLocale) => (key, ...args) => {
  const firstPart = userLocale && userLocale.split("-")[0].split("_")[0];

  //default
  let languageObject = require("./locale/en.json"); //change default to 'en' later

  if (firstPart === "nl") {
    languageObject = require("./locale/nl.json");
  }

  let string =
    languageObject[key] ||
    `Couldn't find key '${key}' for locale '${userLocale}'`;

  args.forEach((arg, index) => {
    string = replaceAll(string, `$${index + 1}`, arg);
  });

  return string;
};

export const numberFormat = (x) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export async function registerForPushNotificationsAsync() {
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
      Alert.alert(
        "Geen toegang",
        "Je hebt notificaties uitgezet. Ga naar instellingen om het aan te zetten.",
        [
          {
            text: "Cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              Platform.OS === "ios"
                ? Linking.openURL("app-settings:")
                : IntentLauncher.startActivityAsync(
                    IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS
                  );
            },
          },
        ]
      );
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("Must use physical device for Push Notifications");
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

export const areYouSure = (callback, message: string) => {
  Alert.alert(
    "Are you sure?",
    message || "Are you sure you want to do this?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },

      { text: "Yes", style: "destructive", onPress: () => callback() },
    ],
    { cancelable: true }
  );
};

export const doOnce = (cb, cleanup) => {
  useEffect(() => {
    cb();
    return cleanup?.();
  }, []);
};
export const apiCall = (endpoint, method, body) => {
  return fetch(`${Constants.SERVER_ADDR}/${endpoint}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  })
    .then((response) => response.json())
    .then(async (response) => {
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const get = (endpoint) => apiCall(endpoint, "GET");
export const post = (endpoint, body) => apiCall(endpoint, "POST", body);

const isIPhoneXSize = (dim: ScaledSize) => {
  return dim.height == 812 || dim.width == 812;
};

const isIPhoneXrSize = (dim: ScaledSize) => {
  return dim.height == 896 || dim.width == 896;
};

export const isIphoneX = () => {
  const dim = Dimensions.get("window");

  return (
    // This has to be iOS
    Platform.OS === "ios" &&
    // Check either, iPhone X or XR
    (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
};

export function ColorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

export const lighterHex = (hex) => ColorLuminance(hex, 0.2);

export const getUserColor = (item, theme) =>
  item?.creditsTotal >= 10000
    ? "red"
    : item?.creditsTotal >= 1000
    ? "yellow"
    : theme.primaryText;

const ranks = [
  {
    rank: "Nobody",
    exp: 50,
  },
  {
    rank: "Vandal",
    exp: 150,
  },
  {
    rank: "Little thief",
    exp: 300,
  },
  {
    rank: "Thief",
    exp: 500,
  },
  {
    rank: "Carthief",
    exp: 800,
  },
  {
    rank: "Criminal",
    exp: 1200,
  },
  {
    rank: "Hitman",
    exp: 1800,
  },
  {
    rank: "Dangerous-Hitman",
    exp: 2800,
  },
  {
    rank: "Gangster",
    exp: 4400,
  },
  {
    rank: "Dangerous-Gangster",
    exp: 7600,
  },
  {
    rank: "Godfather",
    exp: 10000,
  },
  {
    rank: "Dangerous-Godfather",
    exp: 15000,
  },
  {
    rank: "Unlimited-Godfather",
    exp: 22000,
  },
  {
    rank: "Don",
    exp: 30000,
  },
  {
    rank: "Dangerous-Don",
    exp: 40000,
  },
  {
    rank: "Unlimited-Don",
    exp: 60000,
  },
];

const strengthRanks = [
  {
    rank: "Very weak",
    exp: 50,
  },
  {
    rank: "Weak",
    exp: 150,
  },
  {
    rank: "Incredibly amature",
    exp: 300,
  },
  {
    rank: "Amature",
    exp: 500,
  },
  {
    rank: "Normal",
    exp: 800,
  },
  {
    rank: "Judoka",
    exp: 1200,
  },
  {
    rank: "A bit strong",
    exp: 1800,
  },
  {
    rank: "Boxer",
    exp: 2800,
  },
  {
    rank: "Strong",
    exp: 4000,
  },
  {
    rank: "Kickbokser",
    exp: 5600,
  },
  {
    rank: "Super strong",
    exp: 7000,
  },
  {
    rank: "Powerful",
    exp: 9000,
  },
  {
    rank: "Very powerful",
    exp: 11000,
  },
  {
    rank: "Super powerful",
    exp: 14000,
  },
  {
    rank: "Ultra deluxe powerful",
    exp: 17000,
  },
  {
    rank: "Inhumanly powerful",
    exp: 20000,
  },
  {
    rank: "Robotly powerful",
    exp: 25000,
  },
  {
    rank: "Godly",
    exp: 30000,
  },
  {
    rank: "Very godly",
    exp: 35000,
  },
  {
    rank: "Super godly",
    exp: 40000,
  },
  {
    rank: "Ultra deluxe godly",
    exp: 45000,
  },
  {
    rank: "God damn strong",
    exp: 50000,
  },
  {
    rank: "King of the gods",
    exp: 60000,
  },
];

const getRankThing = (rank, returntype, type) => {
  const now = type.findIndex((r) => rank < r.exp);
  const prev = now - 1;

  const nowExp = type[now] ? type[now].exp : type[type.length - 1].exp;
  const prevExp = type[prev] ? type[prev].exp : 0;

  const nowRank = type[now] ? type[now].rank : type[type.length - 1].rank; //last rank always

  const diff = nowExp - prevExp;
  const progress = rank - prevExp;
  const percentage = Math.round((progress / diff) * 100 * 10) / 10;

  if (returntype === "rankname") {
    return nowRank;
  } else if (returntype === "number") {
    return now !== -1 ? now + 1 : type.length;
  } else if (returntype === "percentage") {
    return percentage;
  } else if (returntype === "both") {
    return nowRank + " " + percentage + "%";
  }
};

export const getRank = (rank, returntype) =>
  getRankThing(rank, returntype, ranks);
export const getStrength = (rank, returntype) =>
  getRankThing(rank, returntype, strengthRanks);
