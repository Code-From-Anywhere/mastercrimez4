import * as Icon from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useExpoUpdate } from "../updateHook";
import { getRank, getTextFunction, numberFormat } from "../Util";
const StatsHeader = React.memo(({ me, device, navigation }) => {
  const getText = getTextFunction(me?.locale);
  const textStyle = {
    marginRight: 10,
    marginBottom: 10,
    color: "white",
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

  return (
    updateComponent ||
    notActivated || (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile", { name: me?.name })}
        >
          <Text style={textStyle}>
            {me?.name} {me?.gang?.name}
          </Text>
        </TouchableOpacity>

        {me?.gangId && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Gang", { name: me?.gang?.name })
            }
          >
            <Text style={textStyle}>{me?.gang?.name}</Text>
          </TouchableOpacity>
        )}
        <Text style={textStyle}>❤️ {me?.health}%</Text>

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
        <Text style={textStyle}>
          ⭐️ {getRank(me?.rank, "both")} ({me?.position}e)
        </Text>

        {renderNotVerified}
      </View>
    )
  );
});

export default StatsHeader;
