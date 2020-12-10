import * as Icon from "@expo/vector-icons";
import { AntDesign, Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Chat from "../components/Chat";
import { useExpoUpdate } from "../updateHook";
import { getRank, getStrength, getTextFunction, numberFormat } from "../Util";
import Button from "./Button";
const { width } = Dimensions.get("window");

const isSmallDevice = width < 800;

function Header({ navigation, device, me }) {
  const getText = getTextFunction(me?.locale);

  const textStyle = {
    marginRight: 10,
    marginBottom: 10,
    color: device.theme.secondaryText,
  };

  let updateAvailable = false;
  if (Platform.OS !== "web") {
    updateAvailable = useExpoUpdate();
  }
  const showNotActivated = me?.phoneVerified === false && me?.numActions >= 20;

  const notActivated = showNotActivated && (
    <View
      style={{
        padding: 15,
        backgroundColor: device.theme.secondary,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: device.theme.secondaryText }}>
        {getText("headerNotVerified")}
      </Text>
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          title={getText("headerVerify")}
          onPress={() => navigation.navigate("VerifyPhone")}
        />
        <Button
          title={getText("headerLoginOnAnother")}
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
        {getText("headerUpdateAvailable")}
      </Text>
    </TouchableOpacity>
  );

  const renderNotVerified = !me?.phoneVerified && (
    <View
      style={{
        padding: 5,
        backgroundColor: device.theme.secondary,
        borderRadius: 5,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("VerifyPhone")}
      >
        <AntDesign
          name="exclamationcircleo"
          color="red"
          style={{ marginRight: 10 }}
        />
        <Text
          style={{
            color: device.theme.secondaryText,
            fontWeight: "bold",
          }}
        >
          {getText("headerVerifyYourAccount")}
        </Text>
      </TouchableOpacity>
    </View>
  );
  const dontShowStatsHeader = false;

  const showBackButton = navigation.state.routeName !== "Home";

  const statsHeader = dontShowStatsHeader ? null : (
    <View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
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
        <Text style={textStyle}>
          😎 {me?.name} {me?.gang?.name}
        </Text>
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
        {!me?.newVersion && (
          <Text
            style={textStyle}
            onPress={() => navigation.navigate("Channels")}
          >
            💬 {me?.chats}
          </Text>
        )}
      </View>

      {renderNotVerified}
    </View>
  );

  const backButton = (
    <View
      style={{
        margin: 10,
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      {showBackButton ? (
        <TouchableOpacity
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          onPress={() => {
            if (isSmallDevice || Platform.OS !== "web") {
              navigation.goBack();
            } else {
              window.history.back();
            }
          }}
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

  const webHeader = (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View style={{ width: 50 }}>{backButton}</View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Image
            source={require("../../assets/logos/logo5.jpg")}
            style={{
              margin: 10,
              width: isSmallDevice ? 200 : 600,
              height: isSmallDevice ? 33 : 100,
            }}
          />
        </View>

        <Text style={{ color: "white", marginTop: 20 }}>
          v{Constants.manifest.version}
        </Text>

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

      {isSmallDevice && statsHeader}

      <Chat me={me} device={device} navigation={navigation} />
    </View>
  );

  const showSomething =
    showBackButton ||
    !dontShowStatsHeader ||
    updateAvailable ||
    showNotActivated;

  return (
    <View style={{ justifyContent: "center" }}>
      {Platform.OS === "web" ? (
        webHeader
      ) : (
        <View
          style={{
            backgroundColor: device.theme.secondary,
            paddingTop:
              Platform.OS === "android" && showSomething
                ? StatusBar.currentHeight
                : 0,
          }}
        >
          {backButton}
          {updateComponent || notActivated || statsHeader}
        </View>
      )}
    </View>
  );
}

export default Header;
