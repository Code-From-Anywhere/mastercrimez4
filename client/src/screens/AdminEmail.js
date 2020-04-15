import React, { Component } from "react";
import { View, TextInput } from "react-native";
import T from "../components/T";
import Button from "../components/Button";
import style from "../Style";
import Constants from "../Constants";

class Status extends Component {
  state = {
    response: null,
    subject: null,
    message: null,
  };
  renderForm() {
    return (
      <View>
        {this.state.response ? <T>{this.state.response.response}</T> : null}
        <TextInput
          style={style.textInput}
          placeholder="Onderwerp"
          value={this.state.subject}
          onChangeText={(subject) => this.setState({ subject })}
        />
        <TextInput
          style={style.textInput}
          placeholder="Bericht"
          value={this.state.message}
          onChangeText={(message) => this.setState({ message })}
        />
        <Button
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
