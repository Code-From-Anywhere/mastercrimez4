import moment from "moment";
import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MarkdownView from "react-native-markdown-display";
import Button from "../components/Button";
import MarkdownEditor from "../components/MarkdownEditor";
import T from "../components/T";
import Tabs from "../components/Tabs";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";

class Messages extends Component {
  state = {
    messages: null,
    newMessage: false,
    message: "",
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
        this.setState({ message: null });
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
      screenProps: { device, me },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <ScrollView style={{ flex: 1 }}>
        {this.state.response ? <T>{this.state.response.response}</T> : null}
        <TextInput
          style={style(device.theme).textInput}
          placeholder={getText("title")}
          placeholderTextColor={device.theme.secondaryTextSoft}
          value={this.state.title}
          onChangeText={(title) => this.setState({ title })}
        />

        <MarkdownEditor
          value={this.state.message}
          onChange={(message) => this.setState({ message })}
        />

        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginVertical: 10 }}
          title={getText("send")}
          onPress={this.createTopic}
        />
      </ScrollView>
    );
  }

  renderTopics() {
    const {
      screenProps: { me },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <FlatList
        data={this.state.topics?.topics}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 0.5, backgroundColor: "#000", width: "100%" }}
          />
        )}
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
                  padding: 20,
                }}
              >
                <T>
                  {getText("author")}: {item.name}
                </T>
                <T>
                  {getText("title")}: {item.title}
                </T>
                <T>
                  {getText("lastResponse")}:{" "}
                  {moment(item.updatedAt).format("DD-MM HH:mm")}
                </T>
                <T>
                  {item.responses} {getText("responses")}
                </T>
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
      screenProps: { device, me },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    const item = this.state.topic;
    return item ? (
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            margin: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: "black",
          }}
        >
          <T>
            {getText("author")}: {item.topic.name}
          </T>
          <T>
            {getText("title")}: {item.topic.title}
          </T>
          <T>{item.topic.message}</T>
          <T>
            {item.responses.length} {getText("responses")}
          </T>
        </View>

        <View style={{ flex: 1 }}>
          <T>{getText("responses")}:</T>
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
                    backgroundColor: device.theme.secondary,
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

                <MarkdownView
                  style={{ text: { color: device.theme.primaryText } }}
                >
                  {response.message}
                </MarkdownView>
              </View>
            );
          })}
        </View>

        <View>
          <MarkdownEditor
            value={this.state.message}
            onChange={(message) => this.setState({ message })}
          />

          <Button
            theme={this.props.screenProps.device.theme}
            style={{ marginVertical: 10 }}
            title={getText("send")}
            onPress={this.createMessage}
          />
        </View>
      </ScrollView>
    ) : (
      <T>{getText("topicNotFound")}</T>
    );
  }

  render() {
    const {
      screenProps: { device, me },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    const { newTopic, readTopic } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Tabs
          tabs={[
            {
              title: getText("newTopic"),
              onPress: () =>
                this.setState({ newTopic: true, readTopic: false }),
              isActive: this.state.newTopic,
            },

            {
              title: getText("topics"),
              onPress: () =>
                this.setState({ newTopic: false, readTopic: false }),
              isActive: this.state.newTopic === false && readTopic === false,
            },
          ]}
        />

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
