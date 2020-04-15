import React, { Component } from "react";
import { TouchableOpacity, TextInput, View, FlatList } from "react-native";
import Button from "../components/Button";
import style from "../Style";
import Constants from "../Constants";
import T from "../components/T";
class Messages extends Component {
  state = {
    messages: null,
    newMessage: false,
  };

  componentDidMount() {
    this.getMessages();

    const state = this.props.navigation.state.params?.state;
    if (state) {
      this.setState(state);
    }
  }

  getMessages() {
    const { device } = this.props.screenProps;
    fetch(`${Constants.SERVER_ADDR}/messages?token=${device.loginToken}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({ messages: response });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  sendMessage = () => {
    const { device } = this.props.screenProps;
    const { to, message } = this.state;
    fetch(`${Constants.SERVER_ADDR}/message`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        to,
        message,
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

  fetchReadMessage = (id) => {
    const { device } = this.props.screenProps;
    fetch(`${Constants.SERVER_ADDR}/readMessage`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        //nothing to be done
        this.props.screenProps.reloadMe(device.loginToken);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  deleteMessage = (id) => {
    const { device } = this.props.screenProps;
    fetch(`${Constants.SERVER_ADDR}/deleteMessage`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getMessages();
        this.setState({ readMessage: null });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderNew() {
    return (
      <View>
        {this.state.response ? <T>{this.state.response.response}</T> : null}
        <TextInput
          style={style.textInput}
          placeholder="Aan"
          value={this.state.to}
          onChangeText={(to) => this.setState({ to })}
        />
        <TextInput
          multiline
          numberOfLines={4}
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

  renderMessages() {
    return (
      <FlatList
        data={this.state.messages?.messages}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this.fetchReadMessage(item.id);
                this.setState({ readMessage: item.id });
              }}
            >
              <View style={{ borderWidth: 1, borderColor: "black" }}>
                <T>Van: {item.fromName}</T>
                <T>Verstuurd: {new Date(item.createdAt).toString()}</T>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `item${index}`}
      />
    );
  }

  readMessage() {
    const item = this.state.messages?.messages.find(
      (m) => m.id === this.state.readMessage
    );
    return item ? (
      <View style={{ borderWidth: 1, borderColor: "black" }}>
        <T>Van: {item.fromName}</T>
        <T>Verstuurd: {new Date(item.createdAt).toString()}</T>
        <T>{item.message}</T>
        <View style={{ flexDirection: "row" }}>
          <Button
            title="Terug"
            icon="arrow-back"
            font="MaterialIcons"
            onPress={() => this.setState({ readMessage: null })}
          />
          <Button
            title="Antwoord"
            icon="reply"
            font="FontAwesome"
            onPress={() =>
              this.setState({ newMessage: true, to: item.fromName })
            }
          />
          <Button
            title="Verwijder"
            icon="delete"
            font="MaterialIcons"
            onPress={() => this.deleteMessage(item.id)}
          />
        </View>
      </View>
    ) : (
      <T>Bericht niet gevonden</T>
    );
  }

  render() {
    const { newMessage, readMessage } = this.state;
    return (
      <View style={style.container}>
        <Button
          title={newMessage ? "Berichten" : "Nieuw bericht"}
          onPress={() => this.setState({ newMessage: !newMessage })}
        />
        {newMessage
          ? this.renderNew()
          : readMessage
          ? this.readMessage()
          : this.renderMessages()}
      </View>
    );
  }
}

export default Messages;
