import React from "react";
import { View } from "react-native";
import CountDown from "react-native-countdown-component";
import T from "./T";

class Fly extends React.Component {
  render() {
    const {
      screenProps: { me, device, reloadMe },
      navigation,
    } = this.props;
    const sec = Math.round((me.reizenAt - Date.now()) / 1000);
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <T>Je bent aan het reizen naar {me.city}.</T>
        <CountDown
          until={sec}
          onFinish={() => {
            reloadMe(device.loginToken);
          }}
          size={20}
          timeToShow={["M", "S"]}
          timeLabels={{ m: "Minuten", s: "Seconden" }}
        />
      </View>
    );
  }
}

export default Fly;
