import React from "react";
import { View } from "react-native";
import CountDown from "react-native-countdown-component";

class Fly extends React.Component {
  render() {
    const {
      screenProps: { me, device, reloadMe },
      navigation,
    } = this.props;
    const sec = Math.round((me.reizenAt - Date.now()) / 1000);
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: device.theme.primaryText }}>
          Je bent aan het reizen naar {me.city}.
        </Text>
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
