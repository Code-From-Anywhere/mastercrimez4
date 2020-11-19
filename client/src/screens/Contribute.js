import React, { Component } from "react";
import { Linking, Text, View } from "react-native";
import Button from "../components/Button";
import style from "../Style";
import { getTextFunction } from "../Util";

class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: { me, device },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View style={style(device.theme).container}>
        <Text style={{ color: device.theme.primaryText }}>
          {getText("contributeText")}
        </Text>

        <Button
          theme={this.props.screenProps.device.theme}
          title={getText("contributeCodeCTA")}
          onPress={() => {
            Linking.openURL(
              "https://github.com/EAT-CODE-KITE-REPEAT/mastercrimez4"
            );
          }}
        />
      </View>
    );
  }
}

export default Status;
