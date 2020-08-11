import React, { Component } from "react";
import { Text, TextInput, View } from "react-native";
import Constants from "../Constants";
class Chat extends Component {
  state = {
    chat: [],
    input: "",
  };

  componentDidMount() {
    this.getChat();
    setInterval(() => this.getChat(), 5000);
  }

  getChat() {
    fetch(`${Constants.SERVER_ADDR}/chat`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((chat) => {
        this.setState({ chat });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const {
      navigation,
      screenProps: { device, me },
    } = this.props;

    const { chat, input } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 10 }}>
          {chat.map((item, index) => (
            <Text>
              {item.name}: {item.message}{" "}
            </Text>
          ))}
        </View>
        <TextInput
          value={input}
          style={{
            backgroundColor: "#CCC",
            fontSize: 20,
            margin: 10,
            padding: 5,
            borderRadius: 5,
          }}
          placeholder="Je bericht"
          onChangeText={(input) => this.setState({ input })}
          onSubmitEditing={({ nativeEvent: { text } }) => {
            fetch(`${Constants.SERVER_ADDR}/chat`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: device.loginToken,
                message: text,
              }),
            })
              .then((response) => response.json())
              .then((chat) => {
                this.getChat();
                this.setState({ input: "" });
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
      </View>
    );
  }
}

export default Chat;
