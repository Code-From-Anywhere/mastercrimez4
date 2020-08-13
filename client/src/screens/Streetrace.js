import React, { Component } from "react";
import { Text } from "react-native";

class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;

    return <Text style={{ color: theme.primaryText }}>Coming soon</Text>;
  }
}

export default Status;
