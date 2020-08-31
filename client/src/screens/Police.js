import React from "react";
import { Image, ScrollView, View } from "react-native";
import T from "../components/T";
const AdminUserWatch = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    device: { theme, loginToken },
  },
}) => {
  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {/* show all people with level >2 */}
      <Image
        source={require("../../assets/politie.jpeg")}
        style={{ width: 400, height: 300 }}
      />
      <T>
        De politie zorgt ervoor dat de hackers zich niet teveel kunnen
        misdragen. De politie krijgt elke dag 1 miljoen kogels van de overheid
        om hackers tegen te gaan.
      </T>

      <T bold style={{ marginTop: 20 }}>
        Huidige politie
      </T>
      <T>AlCapone</T>
      <T>WebMaster</T>

      <T bold style={{ marginTop: 20 }}>
        Politie kogelbank:
      </T>
      <T>11.000.000</T>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default AdminUserWatch;
