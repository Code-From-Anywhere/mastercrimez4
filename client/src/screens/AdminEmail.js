import React, { Component } from "react";
import { TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";

class Status extends Component {
  state = {
    response: null,
    subject: null,
    message: null,
  };
  renderForm() {
    const {
      screenProps: { device },
    } = this.props;

    return (
      <View>
        {this.state.response ? <T>{this.state.response.response}</T> : null}
        <TextInput
          style={style(device.theme).textInput}
          placeholderTextColor={device.theme.secondaryTextSoft}
          placeholder="Onderwerp"
          value={this.state.subject}
          onChangeText={(subject) => this.setState({ subject })}
        />
        <TextInput
          placeholderTextColor={device.theme.secondaryTextSoft}
          style={style(device.theme).textInput}
          placeholder="Bericht"
          value={this.state.message}
          onChangeText={(message) => this.setState({ message })}
        />
        <Button
          theme={device.theme}
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
    fetch(`${Constants.SERVER_ADDR}/admin/email`, {
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
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    return me.level < 10 ? <T>Geen toegang</T> : this.renderForm();
  }
}

export default Status;
