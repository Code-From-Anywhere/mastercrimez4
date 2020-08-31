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
      {/* Show all people with isHacker set to true */}
      <Image
        source={require("../../assets/hacker.jpeg")}
        style={{ width: 400, height: 300 }}
      />
      <T>
        {`Als je hackt, cheat, bot, te veel subs hebt, of op een andere manier
misbruik pleegt, kom je op deze lijst te staan. Hackers worden continu
bestraft door de politie. Mocht de politie het niet aan kunnen, dan komt
het leger. Het leger kan ook hackers verbannen en resetten.
\n\n
Houd het spel gezellig en speel eerlijk, en voorkom daarmee dat je op deze lijst komt te staan.`}
      </T>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default AdminUserWatch;
