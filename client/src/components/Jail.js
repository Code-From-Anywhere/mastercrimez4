import React from "react";
import { View } from "react-native";
import T from "./T";
import CountDown from "react-native-countdown-component";

class Jail extends React.Component {
  render() {
    const {
      screenProps: { me, device, reloadMe },
      navigation,
    } = this.props;
    const sec = Math.round((me.jailAt - Date.now()) / 1000);
    return (
      <View>
        <T>Je zit in de gevangenis</T>

        <CountDown
          until={sec}
          size={20}
          timeToShow={["M", "S"]}
          timeLabels={{ m: "Minuten", s: "Seconden" }}
        />
      </View>
    );
  }
}

export default Jail;
