import * as Icon from "@expo/vector-icons";
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
                <Icon.Feather name="menu" size={32} color="white" />
              </TouchableOpacity>
            ) : null}
          </View>

          <Chat device={device} navigation={navigation} />
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            backgroundColor: "#FFF",
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
          <Text style={{ marginRight: 10, marginBottom: 10 }}>
            😎 {me?.name}
          </Text>
          <Text style={{ marginRight: 10, marginBottom: 10 }}>
            💰 €{me?.cash},-
          </Text>
          <Text style={{ marginRight: 10 }}>💵 €{me?.bank},-</Text>
          <View style={{ flexDirection: "row", marginRight: 10 }}>
            <Icon.MaterialCommunityIcons name="pistol" size={18} />
            <Text>{me?.bullets}</Text>
          </View>
          <Text style={{ marginRight: 10 }}>🔥 {me?.gamepoints}</Text>
          <Text style={{ marginRight: 10 }}>🌍 {me?.city}</Text>
          <Text style={{ marginRight: 10 }}>❤️ {me?.health}%</Text>
          <Text style={{ marginRight: 10, marginBottom: 10 }}>
            ⭐️ {getRank(me?.rank, "both")}
          </Text>
          <Text style={{ marginRight: 10 }}>
            💪 {getStrength(me?.strength, "both")}
          </Text>
          <Text style={{ marginRight: 10 }}>🌱 {me?.wiet}</Text>
          <Text style={{ marginRight: 10 }}>🤨 {me?.junkies}</Text>
          <Text style={{ marginRight: 10 }}>💃 {me?.hoeren}</Text>
          <Text
            style={{ marginRight: 10 }}
            onPress={() => navigation.navigate("Messages")}
          >
            💬 {me?.messages}
          </Text>
        </View>
      )}
    </View>
  );
}

export default Header;
