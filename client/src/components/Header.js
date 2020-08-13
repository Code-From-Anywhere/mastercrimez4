import * as Icon from "@expo/vector-icons";
import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Chat from "../components/Chat";
import Constants from "../Constants";
import { getRank, getStrength } from "../Util";
const { width } = Dimensions.get("window");

const isSmallDevice = width < 800;

function Header({ navigation, device, me }) {
  const textStyle = {
    marginRight: 10,
    marginBottom: 10,
    color: device.theme.secondaryText,
  };
  return (
    <View
      style={{
        justifyContent: "center",
        backgroundColor: "#555555",
      }}
    >
      {Platform.OS === "web" ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <Image
                source={require("../../assets/logo.jpg")}
                style={{
                  width: isSmallDevice ? 200 : 600,
                  height: isSmallDevice ? 33 : 100,
                }}
              />
            </View>
            <Text>v{Constants.VERSION}</Text>

            {isSmallDevice ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.toggleDrawer();
                }}
                style={{ margin: 10 }}
              >
                <Feather
                  name="menu"
                  size={32}
                  color="#FFF"
                  style={{ color: "#FFF" }}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <Chat device={device} navigation={navigation} />
        </View>
      ) : (
        <View style={{ backgroundColor: device.theme.secondary }}>
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <TouchableOpacity
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              onPress={() => navigation.goBack()}
            >
              <AntDesign
                name="arrowleft"
                size={32}
                color={device.theme.secondaryText}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              paddingBottom: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          >
            <Text style={textStyle}>😎 {me?.name}</Text>
            <Text style={textStyle}>💰 €{me?.cash},-</Text>
            <Text style={textStyle}>💵 €{me?.bank},-</Text>
            <View style={{ flexDirection: "row" }}>
              <Icon.MaterialCommunityIcons
                name="pistol"
                size={18}
                color={device.theme.secondaryText}
                style={{ marginRight: 5 }}
              />
              <Text style={textStyle}>{me?.bullets}</Text>
            </View>
            <Text style={textStyle}>🔥 {me?.gamepoints}</Text>
            <Text style={textStyle}>🌍 {me?.city}</Text>
            <Text style={textStyle}>❤️ {me?.health}%</Text>
            <Text style={textStyle}>⭐️ {getRank(me?.rank, "both")}</Text>
            <Text style={textStyle}>
              💪 {getStrength(me?.strength, "both")}
            </Text>
            <Text style={textStyle}>🌱 {me?.wiet}</Text>
            <Text style={textStyle}>🤨 {me?.junkies}</Text>
            <Text style={textStyle}>💃 {me?.hoeren}</Text>
            <Text
              style={textStyle}
              onPress={() => navigation.navigate("Messages")}
            >
              💬 {me?.messages}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default Header;
