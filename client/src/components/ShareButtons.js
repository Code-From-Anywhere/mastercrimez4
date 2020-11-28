import * as Icon from "@expo/vector-icons";
import React from "react";
import { Image, Linking, Platform, TouchableOpacity, View } from "react-native";
import { getTextFunction } from "../Util";
import T from "./T";

const ShareButtons = ({ me, url, text }) => {
  const getText = getTextFunction(me?.locale);

  const siteUrl = `https://mastercrimez.com/#/${url}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${siteUrl}`;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <T>{getText("footerShare")}</T>

      <TouchableOpacity
        onPress={() => {
          Linking.openURL(facebookShareUrl);
        }}
      >
        <View
          style={{
            marginLeft: 20,
            backgroundColor: "#3b5998",
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon.FontAwesome name="facebook" color="white" size={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            Platform.OS === "web"
              ? `https://wa.me/?text=${text} ${siteUrl}`
              : `whatsapp://send?text=${text} ${siteUrl}`
          );
        }}
      >
        <Image
          source={require("../../assets/whatsapp.png")}
          style={{ width: 55, height: 55 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ShareButtons;
