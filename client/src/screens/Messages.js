import moment from "moment";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Tabs from "../components/Tabs";
import Constants from "../Constants";
import style from "../Style";

const { width } = Dimensions.get("window");
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
    if (!to || !message) {
      return;
    }
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
        this.setState({ response, message: null, to: null });
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
    const {
      screenProps: { device },
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {this.state.response ? (
          <View>
            <T>{this.state.response.response}</T>
          </View>
        ) : null}

        <TextInput
          style={style(device.theme).textInput}
          placeholder="Aan"
          placeholderTextColor={device.theme.secondaryTextSoft}
          value={this.state.to}
          onChangeText={(to) => this.setState({ to })}
        />
        <TextInput
          multiline
          numberOfLines={4}
          placeholderTextColor={device.theme.secondaryTextSoft}
          style={[
            style(device.theme).textInput,
            {
              height: 200,
              width: "100%",
            },
          ]}
          placeholder="Bericht"
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

  renderMessages() {
    return (
      <FlatList
        style={{ width: "100%" }}
        data={this.state.messages?.messages}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{ paddingVertical: 15 }}
              onPress={() => {
                this.fetchReadMessage(item.id);
                this.setState({ readMessage: item.id });
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <T style={{ fontWeight: item.read ? undefined : "bold" }}>
                  {item.fromName}
                </T>
                <T style={{ fontWeight: item.read ? undefined : "bold" }}>
                  ({moment(item.createdAt).format("DD-MM-YYYY HH:mm")})
                </T>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, width: "100%", backgroundColor: "#000" }} />
        )}
        keyExtractor={(item, index) => `item${index}`}
      />
    );
  }

  readMessage = () => {
    const item = this.state.messages?.messages.find(
      (m) => m.id === this.state.readMessage
    );
    return item ? (
      <View style={{ marginVertical: 20 }}>
        <T>Van: {item.fromName}</T>
        <T>Verstuurd: {moment(item.createdAt).format("DD-MM-YYYY HH:mm")}</T>
        <T style={{ marginTop: 10 }}>{item.message}</T>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Button
            theme={this.props.screenProps.device.theme}
            title="Terug"
            icon="arrow-back"
            font="MaterialIcons"
            onPress={() => {
              this.setState({ readMessage: null });
              this.getMessages();
            }}
          />
          <Button
            theme={this.props.screenProps.device.theme}
            title="Antwoord"
            icon="reply"
            font="FontAwesome"
            onPress={() =>
              this.setState({ newMessage: true, to: item.fromName })
            }
          />
          <Button
            theme={this.props.screenProps.device.theme}
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
  };

  render() {
    const {
      screenProps: { device },
    } = this.props;

    const { newMessage, readMessage } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Tabs
          tabs={[
            {
              title: "Berichten",
              isActive: this.state.newMessage === false,
              onPress: () =>
                this.setState({ newMessage: false, readMessage: false }),
            },
            {
              title: "Nieuw bericht",
              isActive: this.state.newMessage,
              onPress: () => this.setState({ newMessage: true }),
            },
          ]}
        />

        <View style={{ margin: 20, flex: 1 }}>
          {newMessage
            ? this.renderNew()
            : readMessage
            ? this.readMessage()
            : this.renderMessages()}
        </View>
      </View>
    );
  }
}

export default Messages;
