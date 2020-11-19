import React, { Component, Fragment } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MarqueeText from "react-native-marquee";
import Ticker from "react-ticker";
import Constants from "../Constants";
import { getTextFunction } from "../Util";

class Chat extends Component {
  state = {
    chat: [],
    input: "",
  };

  componentDidMount() {
    this.getChat();
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

  chat = () => {
    const { chat } = this.state;
    return chat.map((item, index) => (
      <Text key={`item${index}`}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>:&nbsp;
        {item.message}&nbsp;&nbsp;
      </Text>
    ));
  };
  render() {
    const { device, navigation, me } = this.props;

    const { chat, input } = this.state;

    const getText = getTextFunction(me?.locale);

    const allText = chat
      .map((item) => `${item.name}${item.message}`)
      .join("::::");
    return (
      <View style={{ height: Platform.select({ web: 50, default: 100 }) }}>
        <View
          style={{
            width: "100%",
            backgroundColor: "#444",
            borderWidth: 1,
            borderColor: "black",
            flexDirection: Platform.select({ web: "row", default: undefined }),
          }}
        >
          {Platform.select({
            web: (
              <View style={{ flex: 1, justifyContent: "center" }}>
                {allText ? (
                  <Ticker>
                    {({ index }) => {
                      return (
                        <>
                          {chat.map((item, index) => (
                            <Text
                              style={{ color: "white" }}
                              numberOfLines={1}
                              key={`item${index}`}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate("Profile", {
                                    name: item.name,
                                  });
                                }}
                              >
                                <Text style={{ fontWeight: "bold" }}>
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                              :&nbsp;{item.message}&nbsp;&nbsp;
                            </Text>
                          ))}
                        </>
                      );
                    }}
                  </Ticker>
                ) : null}
              </View>
            ),

            default: (
              <MarqueeText
                style={{ fontSize: 20 }}
                duration={allText.length * 50}
                marqueeOnStart
                loop
                marqueeDelay={200}
                marqueeResetDelay={1000}
              >
                <>
                  {chat.map((item, index) => (
                    <Fragment key={`item${index}`}>
                      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                      :&nbsp;{item.message}&nbsp;&nbsp;
                    </Fragment>
                  ))}
                </>
              </MarqueeText>
            ),
          })}
          <View style={{ width: 100, height: 30 }}>
            <TextInput
              value={input}
              placeholder={getText("chatYourMessage")}
              style={{
                backgroundColor: "#404040",
                fontSize: 20,
                color: "white",
                flex: 1,
                width: 100,
              }}
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

                    if (Platform.OS === "web") {
                      location.reload();
                    }

                    this.setState({ input: "" });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Chat;
