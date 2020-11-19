import React, { Component } from "react";
import { ScrollView, TextInput } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";

class SuperMessage extends Component {
  state = {
    response: null,
    message: null,
  };
  renderForm() {
    const { me, device } = this.props.screenProps;

    const getText = getTextFunction(me?.locale);

    return (
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <T>{getText("superMessageInfo", me?.credits)}</T>
        {this.state.response ? <T>{this.state.response.response}</T> : null}

        <TextInput
          style={{ ...style(device.theme).textInput, height: 200 }}
          placeholder={getText("message")}
          placeholderTextColor={device.theme.secondaryTextSoft}
          multiline
          value={this.state.message}
          onChangeText={(message) => this.setState({ message })}
        />

        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginVertical: 10 }}
          title={getText("send")}
          onPress={this.sendMessage}
        />
      </ScrollView>
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
