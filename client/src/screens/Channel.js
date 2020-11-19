import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-web-refresh-control";
import ImageInput from "../components/ImageInput";
import Constants from "../Constants";
import STYLE from "../Style";
import { getTextFunction, post } from "../Util";

const { width, height } = Dimensions.get("window");
const isBigDevice = width > 500;
const maxWidth = isBigDevice ? 500 : width;

const IMAGE_SIZE = 40;

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      isFetching: true,
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: { params },
      },
      screenProps: {
        device: { loginToken },
      },
    } = this.props;
    this.fetchChat();
    setInterval(() => {
      this.fetchChat();
      post("setRead", { loginToken, id: params?.subid });
    }, 5000);
  }

  fetchChat = () => {
    const {
      screenProps: { device },
      navigation: {
        state: { params },
      },
    } = this.props;

    fetch(
      `${Constants.SERVER_ADDR}/channelmessage?loginToken=${device.loginToken}&id=${params.id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((chat) => {
        this.setState({ chat, isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true }, function () {
      this.fetchChat();
    });
  };

  renderItem = ({ item, index }) => {
    const {
      screenProps: { me },
      navigation,
    } = this.props;
    const isMe = item.user.id === me?.id;
    const avatar = (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile", { name: item.user.username });
        }}
      >
        <Image
          source={{ uri: Constants.SERVER_ADDR + item.user.thumbnail }}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: IMAGE_SIZE / 2,
          }}
        />
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 0,
          justifyContent: isMe ? "flex-end" : "flex-start",
        }}
      >
        {!isMe ? avatar : null}
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: 10,
            backgroundColor: isMe ? "#d9f6c2" : "white",
            padding: 10,
            maxWidth: 200,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: "#CCC",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.user.name ? item.user.name : item.user.username}
            </Text>
          </View>
          {item.image ? (
            <Image
              source={{
                uri: Constants.SERVER_ADDR + item.image,
              }}
              style={{ width: 200, height: 200 }}
              resizeMode="cover"
            />
          ) : null}

          <Text>{item.message}</Text>
        </View>
        {isMe ? avatar : null}
      </View>
    );
  };

  send = () => {
    const {
      screenProps: { device },
      navigation: {
        state: { params },
      },
    } = this.props;
    const { image, message, hasEdited } = this.state;

    const url = `${Constants.SERVER_ADDR}/channelmessage`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginToken: device.loginToken,
        image: hasEdited ? image : undefined,
        message,
        cid: params?.id,
      }),
    })
      .then((response) => response.json())
      .then(({ response, success }) => {
        this.setState({ response });
        if (success) {
          this.fetchChat();
          this.setState({ message: "", image: null });
        }
      })
      .catch((error) => {
        console.log(error, url);
      });
  };

  renderFooter = () => {
    const {
      screenProps: {
        device: { theme },
        me,
      },
    } = this.props;
    const getText = getTextFunction(me?.locale);

    const { image, message, hasEdited, response } = this.state;
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <ImageInput
            small
            value={image}
            onChange={(base64) =>
              this.setState({
                hasEdited: true,
                image: base64,
              })
            }
          />

          <TextInput
            onEndEditing={this.send}
            style={[STYLE(theme).textInput, { flex: 1 }]}
            value={message}
            placeholder={getText("message")}
            onChangeText={(message) => this.setState({ message })}
          />

          <TouchableOpacity onPress={this.send}>
            <Ionicons name="ios-send" size={32} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { chat } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={{
            height: Platform.OS === "web" ? height - 200 : undefined,
          }}
          inverted
          data={chat}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.onRefresh}
            />
          }
        />
        {this.renderFooter()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ChatScreen;
