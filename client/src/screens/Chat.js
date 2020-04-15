import React, { Component } from "react";
import { Text, FlatList, TextInput, View } from "react-native";
import Constants from "../Constants";
class Chat extends Component {
  state = {
    chat: [],
    input: ""
  };

  componentDidMount() {
    this.getChat();
  }

  getChat() {
    fetch(`${Constants.SERVER_ADDR}/chat`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(chat => {
        this.setState({ chat });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const {
      navigation,
      screenProps: { device, me }
    } = this.props;

    const { chat, input } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <marquee style={{ flexDirection: "row" }}>
              {chat.map((item, index) => (
                <span key={`index${index}`}>
                  <b>{item.name}</b>: {item.message} &nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              ))}
            </marquee>
          </View>
          <TextInput
            value={input}
            style={{ backgroundColor: "#CCC", fontSize: 20 }}
            onChangeText={input => this.setState({ input })}
            onSubmitEditing={({ nativeEvent: { text } }) => {
              fetch(`${Constants.SERVER_ADDR}/chat`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  token: device.loginToken,
                  message: text
                })
              })
                .then(response => response.json())
                .then(chat => {
                  this.getChat();
                  this.setState({ input: "" });
                })
                .catch(error => {
                  console.error(error);
                });
            }}
          />
        </View>
      </View>
    );
  }
}

export default Chat;
