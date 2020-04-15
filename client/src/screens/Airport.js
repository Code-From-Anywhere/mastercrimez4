import React, { Component } from "react";
import {
  Image,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";

import Button from "../components/Button";
import Constants from "../Constants";

class Airport extends Component {
  state = {
    response: null,
  };
  renderFooter = () => {
    const { device } = this.props.screenProps;
    const { to } = this.state;

    return (
      <Button
        style={{ borderRadius: 10, marginTop: 20 }}
        title="Vlieg"
        onPress={() => {
          fetch(`${Constants.SERVER_ADDR}/airport`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: device.loginToken,
              to,
            }),
          })
            .then((response) => response.json())
            .then(async (response) => {
              this.setState({ response });
              this.props.screenProps.reloadMe(device.loginToken);
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      />
    );
  };

  openActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [
      "Leeuwarden",
      "Groningen",
      "Assen",
      "Haarlem",
      "Zwolle",
      "Lelystad",
      "Utrecht",
      "Den Haag",
      "Arnhem",
      "Winschoten",
      "s-Hertogenbosh",
      "Maastricht",
      "Amsterdam",
    ];
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: null,
        destructiveButtonIndex: null,
      },
      (buttonIndex) => {
        this.setState({ to: options[buttonIndex] });
      }
    );
  };

  renderForm() {
    return (
      <View>
        <Button
          title={this.state.to ? this.state.to : "Kies stad"}
          onPress={this.openActionSheet}
        />

        {this.renderFooter()}
      </View>
    );
  }
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { response } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ margin: 20, width: 200 }}>
          {response ? (
            <Text style={{ color: "white" }}>{response.response}</Text>
          ) : null}

          {this.renderForm()}
        </View>
      </View>
    );
  }
}

export default connectActionSheet(Airport);
