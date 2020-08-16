import * as Icon from "@expo/vector-icons";
import { AntDesign, Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
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
import { useExpoUpdate } from "../updateHook";
import { getRank, getStrength, numberFormat } from "../Util";
import Button from "./Button";
const { width } = Dimensions.get("window");

const isSmallDevice = width < 800;

function Header({ navigation, device, me }) {
  const updateAvailable = useExpoUpdate();

  const textStyle = {
    marginRight: 10,
    marginBottom: 10,
    color: device.theme.secondaryText,
  };

  const notActivated = me?.phoneVerified === false && (
    <View
      style={{
        padding: 15,
        backgroundColor: device.theme.secondary,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: device.theme.secondaryText }}>
        Je account is nog niet geverifieerd!
      </Text>
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          theme={device.theme}
          title="Verifiëer"
          onPress={() => navigation.navigate("VerifyPhone")}
        />
        <Button
          theme={device.theme}
          title="Login op een ander account"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </View>
  );

  const updateComponent = updateAvailable && (
    <TouchableOpacity
      onPress={() => Updates.reloadAsync()}
      style={{
        padding: 15,
        backgroundColor: device.theme.secondary,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: device.theme.secondaryText }}>
        Er is een nieuwe update beschikbaar! Klik hier om de app te verversen.
      </Text>
    </TouchableOpacity>
  );

  const webHeader = (
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
        <Text style={{ color: "white" }}>v{Constants.manifest.version}</Text>

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
  );

  const statsHeader = (
    <>
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
        <Text style={textStyle}>💰 €{numberFormat(me?.cash)},-</Text>
        <Text style={textStyle}>💵 €{numberFormat(me?.bank)},-</Text>
        <View style={{ flexDirection: "row" }}>
          <Icon.MaterialCommunityIcons
            name="pistol"
            size={18}
            color={device.theme.secondaryText}
            style={{ marginRight: 5 }}
          />
          <Text style={textStyle}>{numberFormat(me?.bullets)}</Text>
        </View>
        <Text style={textStyle}>🔥 {me?.gamepoints}</Text>
        <Text style={textStyle}>🌍 {me?.city}</Text>
        <Text style={textStyle}>❤️ {me?.health}%</Text>
        <Text style={textStyle}>
          ⭐️ {getRank(me?.rank, "both")} ({me?.position}e)
        </Text>
        <Text style={textStyle}>💪 {getStrength(me?.strength, "both")}</Text>
        <Text style={textStyle} onPress={() => navigation.navigate("Messages")}>
          💬 {me?.messages}
        </Text>
      </View>
    </>
  );

  const backButton = (
    <View
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 20,
      }}
    >
      {navigation.state.routeName !== "Home" ? (
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
      ) : (
        <View style={{ height: 20 }} />
      )}
    </View>
  );
  return (
    <View
      style={{
        justifyContent: "center",
        backgroundColor: "#555",
      }}
    >
      {Platform.OS === "web" ? (
        webHeader
      ) : (
        <View style={{ backgroundColor: device.theme.secondary }}>
          {backButton}
          {updateComponent || notActivated || statsHeader}
        </View>
      )}
    </View>
  );
}

export default Header;
