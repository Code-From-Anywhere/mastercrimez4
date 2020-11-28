import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import Constants from "../Constants";
import T from "./T";

const Gang = ({ gang, navigation, size = 60 }) => {
  const theme = useSelector((state) => state.device.theme);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Gang", { name: gang.name });
      }}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <View
        style={{
          backgroundColor: theme.primary,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: theme.secondary,
        }}
      >
        {gang.thumbnail ? (
          <Image
            source={{ uri: Constants.SERVER_ADDR + gang.thumbnail }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        )}
      </View>
      <View style={{ marginLeft: 20 }}>
        <T>{gang.name}</T>
      </View>
    </TouchableOpacity>
  );
};

export default Gang;
