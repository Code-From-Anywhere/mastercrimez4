import React, { Component } from "react";
import { Text } from "react-native";

class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: { me }
    } = this.props;

    return <Text>Coming soon</Text>;
  }
}

export default Status;
