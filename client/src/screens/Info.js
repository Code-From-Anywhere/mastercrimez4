import React, { Component } from "react";
import { Linking, View } from "react-native";
import Menu from "../components/Menu";

class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    return (
      <View>
        <Menu
          title="Feedback & Contact"
          onPress={() => Linking.openURL("mailto:mastercrimez@karsens.com")}
        />
        <Menu navigation={navigation} title="Spel info" to="InfoGame" />
        <Menu navigation={navigation} title="Privacy Policy" to="Privacy" />
        <Menu navigation={navigation} title="Regels" to="InfoRules" />
        <Menu navigation={navigation} title="Draag bij" to="Contribute" />
        <Menu navigation={navigation} title="Prijzen" to="Prizes" />
      </View>
    );
  }
}

export default Status;
