import * as Icon from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Clipboard,
  Dimensions,
  Image,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import T from "../components/T";
import { getTextFunction } from "../Util";
import Button from "./Button";
const { width } = Dimensions.get("window");

function Footer({ navigation, screenProps: { me } }) {
  const getText = getTextFunction(me?.locale);

  const theme = useSelector((state) => state.device.theme);
  const [text, setText] = useState("");
  const url = `https://mastercrimez.com/#/Accomplice?accomplice=${me?.name}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmastercrimez.com%2F#%2FAccomplice%2F?accomplice=${me?.name}`;

  const copy = () => {
    Clipboard.setString(url);
    setText("Gekopiëerd naar klembord");
  };
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ margin: 10 }}>
        <T bold>{getText("footerInviteFriends")}</T>
        <View style={{ marginBottom: 20 }}>
          <T>{getText("footerInviteText")}</T>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              value={url}
              style={{
                color: theme.secondaryText,
                backgroundColor: theme.secondary,
                height: 35,
                borderRadius: 10,
                paddingHorizontal: 10,
                width: 200,
              }}
              onFocus={copy}
            />
            <Button
              theme={theme}
              title={getText("footerCopy")}
              onPress={copy}
            />
          </View>
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
                  `whatsapp://send?text=${getText("footerWhatsappText", url)}`
                );
              }}
            >
              <Image
                source={require("../../assets/whatsapp.png")}
                style={{ width: 55, height: 55 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
