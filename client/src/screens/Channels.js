import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-web-refresh-control";
import Separator from "../components/Separator";
import T from "../components/T";
import Constants from "../Constants";

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channelsubs: [],
      isFetching: true,
    };
  }

  componentDidMount() {
    this.fetchChannelsubs();
  }

  fetchChannelsubs = () => {
    const {
      screenProps: { device },
    } = this.props;
    fetch(
      `${Constants.SERVER_ADDR}/channelsubs?loginToken=${device.loginToken}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((channelsubs) => {
        if (channelsubs.response) {
          this.setState({ response: channelsubs.response });
        } else {
          this.setState({ channelsubs });
        }
        this.setState({ isFetching: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onRefresh = () => {
    this.setState({ isFetching: true }, function () {
      this.fetchChannelsubs();
    });
  };

  renderItem = ({ item, index }) => {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    // console.log(item);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Channel", { id: item.channel.id })}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#CCC",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="ios-people" color="white" size={32} />
          </View>
          {item.unread > 0 ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 40,
                width: 25,
                height: 25,
                borderRadius: 13,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>{item.unread}</Text>
            </View>
          ) : null}

          <View style={{ marginLeft: 20 }}>
            <T bold>
              {item.channel.name
                ? item.channel.name
                : item.channel.channelsubs.length === 2
                ? item.channel.channelsubs.find((x) => x.userId !== me?.id)
                    ?.user.name
                : "(RAAAR)"}
            </T>
            {item.lastmessage ? <T>{item.lastmessage}</T> : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { navigation } = this.props;
    const { channelsubs } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={channelsubs}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => <Separator />}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.onRefresh}
            />
          }
        />
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
