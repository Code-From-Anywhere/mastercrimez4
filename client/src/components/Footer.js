import * as Icon from "@expo/vector-icons";
import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import T from "../components/T";
import { getTextFunction } from "../Util";

function Footer({ navigation, screenProps: { me } }) {
  const getText = getTextFunction(me?.locale);

  const theme = useSelector((state) => state.device.theme);

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <T>{getText("footerFollowUs")}</T>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              "https://www.facebook.com/Mastercrimez-100872595072798"
            );
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
          style={{ marginLeft: 20 }}
          onPress={() => {
            Linking.openURL("https://www.instagram.com/mastercrimez.nl/");
          }}
        >
          <Image
            source={require("../../assets/instagram.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            Linking.openURL(
              "https://open.spotify.com/playlist/5n5j78gTXOM9h2SOdz0Ay5?si=9gBkeObkTXaqFZxHLFutIA"
            );
          }}
        >
          <Image
            source={require("../../assets/spotify.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            Linking.openURL(
              "https://www.youtube.com/channel/UCGqGRq-iNxXdLrMx9AlD7qw"
            );
          }}
        >
          <Image
            source={require("../../assets/youtube.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ height: 20 }} />

      <Text style={{ color: theme.primaryText }}>
        &copy; MasterCrimeZ 2006-{new Date().getFullYear()}
      </Text>
    </View>
  );
}

export default Footer;
