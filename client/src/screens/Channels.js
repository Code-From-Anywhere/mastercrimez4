import { connectActionSheet } from "@expo/react-native-action-sheet";
import { Entypo, Ionicons } from "@expo/vector-icons";
import moment from "moment";
import * as React from "react";
import {
  FlatList,
  Image,
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
import { getTextFunction, post } from "../Util";

const blocksReleaseDate = moment("15/02/2021", "DD/MM/YYYY").set("hour", 17);

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

    this.interval = setInterval(() => this.fetchChannelsubs(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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

  openMenu = (id, userId) => {
    const { device, me } = this.props.screenProps;
    const getText = getTextFunction(this.props.screenProps.me?.locale);

    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [getText("delete")];

    const isBlockButtonActive =
      (moment().isAfter(blocksReleaseDate) || me?.level > 1) && userId;
    if (isBlockButtonActive) {
      options.push(getText("blockThisUser"));
    }

    options.push(getText("cancel"));

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: null,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log("delete", id);
          await post("setDeleted", { loginToken: device.loginToken, id: id });
          this.fetchChannelsubs();
        }
        if (isBlockButtonActive && buttonIndex === 1) {
          const { response } = await post("addBlock", {
            loginToken: device.loginToken,
            user2id: userId,
          });
          alert(response);
        }
        // Do something here depending on the button index selected
      }
    );
  };

  openGeneralMenu = () => {
    const { device, me } = this.props.screenProps;
    const { navigation } = this.props;

    const getText = getTextFunction(this.props.screenProps.me?.locale);

    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [getText("deleteAllChats")];

    const isBlocksActive = moment().isAfter(blocksReleaseDate) || me?.level > 1;

    if (isBlocksActive) {
      options.push(getText("blocks"));
    }
    options.push(getText("cancel"));

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: null,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log("deleteAll");
          await post("deleteAll", { loginToken: device.loginToken });
          this.fetchChannelsubs();
        }
        if (buttonIndex === 1 && isBlocksActive) {
          navigation.navigate("Blocks");
        }
        // Do something here depending on the button index selected
      }
    );
  };
  renderItem = ({ item, index }) => {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme, loginToken },
      },
    } = this.props;
    // console.log(item);

    const channelTitle = item.channel?.name
      ? item.channel?.name
      : item.channel?.channelsubs.length === 2
      ? item.channel?.channelsubs.find((x) => x.userId !== me?.id)?.user?.name
      : "(System)";

    const channelThumbnail = item.channel?.image
      ? item.channel?.image
      : item.channel?.channelsubs.length === 2
      ? item.channel?.channelsubs.find((x) => x.userId !== me?.id)?.user
          ?.thumbnail
      : null;

    const channelOtherUserId = item.channel?.image
      ? item.channel?.image
      : item.channel?.channelsubs.length === 2
      ? item.channel?.channelsubs.find((x) => x.userId !== me?.id)?.user?.id
      : null;

    return (
      <TouchableOpacity
        onPress={() => {
          post("setRead", { loginToken, id: item.id });
          navigation.navigate("Channel", {
            id: item.channel?.id,
            subid: item.id,
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          {channelThumbnail ? (
            <Image
              source={{ uri: Constants.SERVER_ADDR + channelThumbnail }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
          ) : (
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
          )}
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

          <View style={{ marginLeft: 20, flex: 1 }}>
            <T bold>
              {/* name or other person in chat */}
              {channelTitle}
            </T>
            {item.lastmessage ? (
              <T numberOfLines={1}>{item.lastmessage}</T>
            ) : null}
          </View>

          <View>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => this.openMenu(item.id, channelOtherUserId)}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Entypo
                style={{ marginLeft: 10 }}
                name="dots-three-horizontal"
                size={20}
                color={theme.primaryText}
              />
            </TouchableOpacity>
            <T>
              {moment(item.lastmessageDate).format(
                moment(item.lastmessageDate).isAfter(moment().startOf("day"))
                  ? "HH:mm"
                  : "DD-MM-YYYY"
              )}
            </T>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      navigation,
      screenProps: {
        device: { theme },
      },
    } = this.props;
    const { channelsubs } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          ListHeaderComponent={() => {
            return (
              <View
                style={{
                  justifyContent: "flex-end",
                  marginRight: 20,
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => this.openGeneralMenu()}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <Entypo
                    style={{ marginLeft: 10 }}
                    name="dots-three-horizontal"
                    size={20}
                    color={theme.primaryText}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
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

export default connectActionSheet(ChatScreen);
