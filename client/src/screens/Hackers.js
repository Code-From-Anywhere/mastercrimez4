import React from "react";
import { Image, ScrollView, View } from "react-native";
import T from "../components/T";
import { getTextFunction } from "../Util";
const AdminUserWatch = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    device: { theme, loginToken },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {/* Show all people with isHacker set to true */}
      <Image
        source={require("../../assets/hacker.jpeg")}
        style={{ width: 400, height: 300 }}
      />
      <T>{getText("hackersInfo")}</T>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default AdminUserWatch;
