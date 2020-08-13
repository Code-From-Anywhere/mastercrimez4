import moment from "moment";
import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";
class Messages extends Component {
  state = {
    messages: null,
    newMessage: false,
  };

  componentDidMount() {
    this.getTopics();

    const state = this.props.navigation.state.params?.state;
    if (state) {
      this.setState(state);
    }
  }

  getTopics() {
    const { device } = this.props.screenProps;
    fetch(`${Constants.SERVER_ADDR}/topics?token=${device.loginToken}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({ topics: response });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  createTopic = () => {
    const { device } = this.props.screenProps;
    const { title, message } = this.state;
    fetch(`${Constants.SERVER_ADDR}/topic`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        title,
        message,
      }),
    })
      .then((response) => response.json())
      .then(({ response, success }) => {
        this.setState({ response });
        if (success) {
          this.getTopics();
          this.setState({ newTopic: false, readTopic: false }); //to see topics
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  createMessage = () => {
    const { device } = this.props.screenProps;
    const { message } = this.state;
    console.log("Creating message");
    fetch(`${Constants.SERVER_ADDR}/response`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        id: this.state.readTopic,
        response: message,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response);
        this.fetchReadTopic(this.state.readTopic);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  fetchReadTopic = (id) => {
    const { device } = this.props.screenProps;
    fetch(
      `${Constants.SERVER_ADDR}/topic?token=${device.loginToken}&id=${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({ topic: response });
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
      <View>
        {this.state.response ? <T>{this.state.response.response}</T> : null}
        <TextInput
          style={style(device.theme).textInput}
          placeholder="Titel"
          value={this.state.title}
          onChangeText={(title) => this.setState({ title })}
        />
        <TextInput
          multiline
          numberOfLines={4}
          style={style(device.theme).textInput}
          placeholder="Bericht"
          value={this.state.message}
          onChangeText={(message) => this.setState({ message })}
        />
        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginVertical: 10 }}
          title="Verzenden"
          onPress={this.createTopic}
        />
      </View>
    );
  }

  renderTopics() {
    return (
      <FlatList
        data={this.state.topics?.topics}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this.fetchReadTopic(item.id);
                this.setState({ readTopic: item.id });
              }}
            >
              <View
                style={{
                  flex: 1,
                  margin: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "black",
                }}
              >
                <T>Auteur: {item.name}</T>
                <T>Titel: {item.title}</T>
                <T>
                  Laatste reactie:{" "}
                  {moment(item.updatedAt).format("DD-MM HH:mm")}
                </T>
                <T>{item.responses} reacties</T>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `item${index}`}
      />
    );
  }

  readTopic() {
    const {
      screenProps: { device },
    } = this.props;

    const item = this.state.topic;
    return item ? (
      <ScrollView style={{ borderWidth: 1, borderColor: "black" }}>
        <View
          style={{
            flex: 1,
            margin: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: "black",
          }}
        >
          <T>Auteur: {item.topic.name}</T>
          <T>Titel: {item.topic.title}</T>
          <T>{item.topic.message}</T>
          <T>{item.responses.length} reacties</T>
        </View>

        <View style={{ flex: 1 }}>
          <T>Reacties:</T>
          {item.responses.map((response) => {
            return (
              <View
                key={`item${response.id}`}
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  padding: 20,
                  marginVertical: 20,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "black",
                    top: -10,
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 3,
                  }}
                >
                  <T>
                    {response.name} op{" "}
                    {moment(response.createdAt).format("DD-MM HH:mm")}
                  </T>
                </View>
                <T>{response.message}</T>
              </View>
            );
          })}
        </View>

        <View>
          <TextInput
            multiline
            numberOfLines={4}
            style={style(device.theme).textInput}
            placeholder="Reageer"
            value={this.state.message}
            onChangeText={(message) => this.setState({ message })}
          />
          <Button
            theme={this.props.screenProps.device.theme}
            style={{ marginVertical: 10 }}
            title="Verzenden"
            onPress={this.createMessage}
          />
        </View>
      </ScrollView>
    ) : (
      <T>Topic niet gevonden</T>
    );
  }

  render() {
    const {
      screenProps: { device },
    } = this.props;

    const { newTopic, readTopic } = this.state;
    return (
      <View style={style(device.theme).container}>
        <View style={{ flexDirection: "row" }}>
          <Button
            theme={this.props.screenProps.device.theme}
            title={"Nieuw topic"}
            onPress={() => this.setState({ newTopic: true, readTopic: false })}
          />
          <Button
            theme={this.props.screenProps.device.theme}
            title={"Topics"}
            onPress={() => this.setState({ newTopic: false, readTopic: false })}
          />
        </View>

        {newTopic
          ? this.renderNew()
          : readTopic
          ? this.readTopic()
          : this.renderTopics()}
      </View>
    );
  }
}

export default Messages;
