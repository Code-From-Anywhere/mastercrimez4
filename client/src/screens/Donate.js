import React, { Component } from "react";
import { Image, Text, View, TextInput } from "react-native";
import Button from "../components/Button";
import style from "../Style";
import { connectActionSheet } from "@expo/react-native-action-sheet";

import Constants from "../Constants";

class Donate extends Component {
  state = {
    response: null,
  };

  componentDidMount() {
    const to = this.props.navigation.state.params?.to;
    if (to) {
      this.setState({ to });
    }
  }

  renderFooter = () => {
    const { device } = this.props.screenProps;
    const { to, amount, type } = this.state;

    return (
      <Button
        style={{ marginTop: 20 }}
        title="Doneer"
        onPress={() => {
          fetch(`${Constants.SERVER_ADDR}/donate`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loginToken: device.loginToken,
              to,
              type,
              amount,
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
      "Contant Geld",
      "Kogels",
      "Wiet",
      "Junkies",
      "Hoeren",
      "Gamepoints",
    ];
    const keys = ["cash", "bullets", "wiet", "junkies", "hoeren", "gamepoints"];
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: null,
        destructiveButtonIndex: null,
      },
      (buttonIndex) => {
        this.setState({ type: keys[buttonIndex] });
      }
    );
  };

  renderForm() {
    const names = {
      bullets: "Kogels",
      cash: "Geld",
      wiet: "Wiet",
      junkies: "Junkies",
      hoeren: "Hoeren",
      gamepoints: "Gamepoints",
    };
    return (
      <View>
        <TextInput
          style={style.textInput}
          placeholder="Aan"
          value={this.state.to}
          onChangeText={(to) => this.setState({ to })}
        />
        <TextInput
          style={style.textInput}
          placeholder="Hoeveelheid"
          value={this.state.amount}
          onChangeText={(amount) => this.setState({ amount })}
        />
        <Button
          style={{ marginVertical: 10 }}
          title={
            this.state.type ? names[this.state.type] : "Wat wil je doneren?"
          }
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
      <View style={style.container}>
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

export default connectActionSheet(Donate);