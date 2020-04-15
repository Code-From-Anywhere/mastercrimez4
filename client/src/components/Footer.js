import React from "react";
import { View, Text, Button, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

function Footer({ navigation }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ color: "white" }}>&copy; MasterCrimeZ 2020</Text>
    </View>
  );
}

export default Footer;
