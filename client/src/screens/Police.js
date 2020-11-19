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
      {/* show all people with level >2 */}
      <Image
        source={require("../../assets/politie.jpeg")}
        style={{ width: 400, height: 300 }}
      />
      <T>{getText("policeInfo")}</T>

      <T bold style={{ marginTop: 20 }}>
        {getText("currentPolice")}
      </T>
      <T>AlCapone</T>
      <T>WebMaster</T>

      <T bold style={{ marginTop: 20 }}>
        {getText("policeBulletBank")}:
      </T>
      <T>11.000.000</T>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default AdminUserWatch;
