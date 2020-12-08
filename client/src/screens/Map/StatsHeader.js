import * as Icon from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { getRank, numberFormat } from "../../Util";

const StatsHeader = React.memo(({ me, device }) => {
  const textStyle = {
    marginRight: 10,
    marginBottom: 10,
    color: "white",
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={textStyle}>
        {me?.name} {me?.gang?.name}
      </Text>
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
    </View>
  );
});

export default StatsHeader;
