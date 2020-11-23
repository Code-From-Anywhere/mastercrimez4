import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import Constants from "../Constants";
import { getLocale, getUserColor } from "../Util";
import T from "./T";

const SIZE = 60;
const User = ({ user, navigation }) => {
  const theme = useSelector((state) => state.device.theme);

  const color = getUserColor(user, theme);
  const isOnline = (Date.now() - user.onlineAt) / 60000 < 5;

  const extraIcon =
    user.level === 2
      ? "💼"
      : user.level === 3
      ? "🕶"
      : user.level === 10
      ? "🤓"
      : null;

  const country = getLocale(user.locale) === "nl" ? "🇳🇱" : "🌍";

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Profile", { name: user.name });
      }}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <View
        style={{
          backgroundColor: theme.primary,
          borderRadius: SIZE / 2,
          borderWidth: 1,
          borderColor: theme.secondary,
        }}
      >
        {user.thumbnail ? (
          <Image
            source={{ uri: Constants.SERVER_ADDR + user.thumbnail }}
            style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
          />
        ) : (
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
          />
        )}
        <View style={{ position: "absolute", top: 0, right: 0 }}>
          <T>{isOnline ? "✅" : "🛑"}</T>
        </View>

        {extraIcon && (
          <View style={{ position: "absolute", bottom: 0, right: 0 }}>
            <T>{extraIcon}</T>
          </View>
        )}

        {user.gang && user.gang.thumbnail && (
          <View style={{ position: "absolute", top: -8, left: -8 }}>
            <Image
              source={{ uri: Constants.SERVER_ADDR + user.gang.thumbnail }}
              style={{
                width: SIZE / 2,
                height: SIZE / 2,
                borderRadius: SIZE / 4,
              }}
            />
          </View>
        )}

        <View style={{ position: "absolute", bottom: 0, left: 0 }}>
          <T>{country}</T>
        </View>
      </View>
      <View style={{ marginLeft: 20 }}>
        <T style={{ color }}>{user.name}</T>
        {user.gang && <T>{user.gang.name}</T>}
      </View>
    </TouchableOpacity>
  );
};

export default User;
