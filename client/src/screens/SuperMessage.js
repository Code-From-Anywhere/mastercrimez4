import React, { Component } from "react";
import { TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";

class SuperMessage extends Component {
  state = {
    response: null,
    message: null,
  };
  renderForm() {
    const { me, device } = this.props.screenProps;

    return (
      <View style={{ flex: 1, margin: 15 }}>
        <T>
          Je hebt {me?.credits} credits. Een superbericht kost 500 credits. Een
          superbericht word naar alle geverifieerde spelers gestuurd, dood of
          levend.
        </T>
        {this.state.response ? <T>{this.state.response.response}</T> : null}

        <TextInput
          style={{ ...style(device.theme).textInput, height: 200 }}
          placeholder="Bericht"
          multiline
          value={this.state.message}
          onChangeText={(message) => this.setState({ message })}
        />

        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginVertical: 10 }}
          title="Verzenden"
          onPress={this.sendMessage}
        />
      </View>
    );
  }

  sendMessage = () => {
    const { device } = this.props.screenProps;
    const { message, subject } = this.state;
    fetch(`${Constants.SERVER_ADDR}/superMessage`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        message,
        subject,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({ response });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return this.renderForm();
  }
}

export default SuperMessage;
