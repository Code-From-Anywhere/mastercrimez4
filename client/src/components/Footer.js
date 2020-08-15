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
import Button from "./Button";
const { width } = Dimensions.get("window");

function Footer({ navigation, screenProps: { me } }) {
  const theme = useSelector((state) => state.device.theme);
  const [text, setText] = useState("");
  const url = `https://mastercrimez.nl/#/Accomplice?accomplice=${me?.name}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmastercrimez.nl%2F#%2FAccomplice%2F?accomplice=${me?.name}`;

  const copy = () => {
    Clipboard.setString(url);
    setText("Gekopiëerd naar klembord");
  };
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ margin: 10 }}>
        <T bold>Vrienden uitnodigen</T>
        <View style={{ marginBottom: 20 }}>
          <T>
            Deel deze link met vrienden, zodat ze jouw handlanger worden als ze
            beginnen met spelen!
          </T>
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
            <Button theme={theme} title="Kopiëer" onPress={copy} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <T>Delen</T>

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
                  `whatsapp://send?text=Hey kom ook deze vette game spelen! ${url}`
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
        <T>Volg ons</T>
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
              "https://open.spotify.com/playlist/4ii4W0n7GaiATVlE4ztUyd?si=fTa9WJyRQne2QbzPRihLMg"
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

      <Text style={{ color: theme.primaryText }}>&copy; MasterCrimeZ 2020</Text>
    </View>
  );
}

export default Footer;
