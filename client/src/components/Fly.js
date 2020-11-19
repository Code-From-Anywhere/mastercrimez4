import React from "react";
import { Text, View } from "react-native";
import CountDown from "react-native-countdown-component";
import { getTextFunction } from "../Util";

class Fly extends React.Component {
  render() {
    const {
      screenProps: { me, device, reloadMe },
      navigation,
    } = this.props;
    const sec = Math.round((me.reizenAt - Date.now()) / 1000);
    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: device.theme.primaryText }}>
          {getText("flyYoureTravelingTo", me?.city)}
        </Text>
        <CountDown
          until={sec}
          onFinish={() => {
            reloadMe(device.loginToken);
          }}
          size={20}
          timeToShow={["M", "S"]}
          timeLabels={{ m: getText("minutes"), s: getText("seconds") }}
        />
      </View>
    );
  }
}

export default Fly;
