import { connectActionSheet } from "@expo/react-native-action-sheet";
import React, { Component } from "react";
import { Text, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import { getTextFunction } from "../Util";

class Airport extends Component {
  state = {
    response: null,
  };
  renderFooter = () => {
    const { device, me } = this.props.screenProps;
    const { to } = this.state;

    const getText = getTextFunction(me?.locale);

    return (
      <Button
        theme={device.theme}
        style={{ borderRadius: 10, marginTop: 20 }}
        title={getText("fly")}
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
        // cancelButtonIndex: null,
        // destructiveButtonIndex: null,
      },
      (buttonIndex) => {
        this.setState({ to: options[buttonIndex] });
      }
    );
  };

  renderForm() {
    const getText = getTextFunction(this.props.screenProps.me?.locale);
    return (
      <View>
        <Button
          theme={this.props.screenProps.device.theme}
          title={this.state.to ? this.state.to : getText("chooseCity")}
          onPress={this.openActionSheet}
        />

        {this.renderFooter()}
      </View>
    );
  }
  render() {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;
    const { response } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ margin: 20, width: 200 }}>
          {response ? (
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>
          ) : null}

          {this.renderForm()}
        </View>
      </View>
    );
  }
}

export default connectActionSheet(Airport);
