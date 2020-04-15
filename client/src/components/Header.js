import React from "react";
import { Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Chat from "../components/Chat";
import Constants from "../Constants";
const { width } = Dimensions.get("window");

const isSmallDevice = width < 800;

function Header({ navigation, device }) {
  return (
    <View
      style={{
        justifyContent: "center",
        backgroundColor: "yellow",
        backgroundColor: "#555555",
      }}
    >
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
            <Icon name="menu" size={32} color="white" />
          </TouchableOpacity>
        ) : null}
      </View>

      <Chat device={device} navigation={navigation} />
    </View>
  );
}

export default Header;
