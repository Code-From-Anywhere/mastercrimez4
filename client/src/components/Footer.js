import React from "react";
import { Dimensions, Text, View } from "react-native";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

function Footer({ navigation }) {
  const theme = useSelector((state) => state.device.theme);

  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ color: theme.primaryText }}>&copy; MasterCrimeZ 2020</Text>
    </View>
  );
}

export default Footer;
