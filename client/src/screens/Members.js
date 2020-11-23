import { connectActionSheet } from "@expo/react-native-action-sheet";
import React, { Component } from "react";
import { Dimensions, FlatList, Platform, TextInput, View } from "react-native";
import * as Icon from "react-native-vector-icons";
import Button from "../components/Button";
import Separator from "../components/Separator";
import T from "../components/T";
import User from "../components/User";
import Constants from "../Constants";
import { getRank, getStrength, getTextFunction } from "../Util";
const { height } = Dimensions.get("window");
const orders = [
  {
    key: "onlineAt",
    title: "Online",
  },

  {
    key: "cash",
    title: "Contant",
  },

  {
    key: "bank",
    title: "Bank",
  },
  {
    key: "hoeren",
    title: "Hoeren",
  },
  {
    key: "junkies",
    title: "Junkies",
  },
  {
    key: "wiet",
    title: "Wiet",
  },
  {
    key: "rank",
    title: "Rang",
  },
  {
    key: "strength",
    title: "Moordrang",
  },
];
class Members extends Component {
  constructor(props) {
    super(props);

    const getText = getTextFunction(props.screenProps.me?.locale);
    this.state = {
      members: [],
      search: null,
      orderBy: {
        key: "onlineAt",
        title: getText("online"),
      },
    };
  }

  componentDidMount() {
    const { device } = this.props.screenProps;

    this.fetchMembers(this.state.orderBy.key);

    const order = this.props.navigation.state.params?.order;
    if (order) {
      this.setState({ orderBy: orders[order] });
      this.fetchMembers(orders[order].key);
    }
  }

  fetchMembers(order) {
    fetch(`${Constants.SERVER_ADDR}/members?order=${order}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (members) => {
        this.setState({ members });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;

    const orderKey = this.state.orderBy.key;

    const isOnline = (Date.now() - item.onlineAt) / 60000 < 5;
    const secondKey =
      orderKey === "onlineAt"
        ? isOnline
          ? "✅"
          : "🛑"
        : orderKey === "cash"
        ? `€${item.cash},-`
        : orderKey === "hoeren"
        ? `${item.hoeren}`
        : orderKey === "junkies"
        ? `${item.junkies}`
        : orderKey === "wiet"
        ? `${item.wiet}`
        : orderKey === "rank"
        ? `${getRank(item.rank, "both")}`
        : orderKey === "strength"
        ? `${getStrength(item.strength, "both")}`
        : `€${item.bank},-`;

    return (
      <View
        key={`item${index}`}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <User navigation={navigation} user={item} />
        <T>{secondKey}</T>
      </View>
    );
  };

  openActionSheet = () => {
    const getText = getTextFunction(this.props.screenProps.me?.locale);

    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = orders.map((o) => o.title);

    options.push(getText("cancel"));
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: null,
      },
      (buttonIndex) => {
        if (buttonIndex < options.length - 1) {
          this.setState({ orderBy: orders[buttonIndex] });
          this.fetchMembers(orders[buttonIndex].key);
        }
        // Do something here depending on the button index selected
      }
    );
  };

  renderHeader = () => {
    const getText = getTextFunction(this.props.screenProps.me?.locale);

    const { members, search } = this.state;

    return (
      <View
        style={{ backgroundColor: this.props.screenProps.device.theme.primary }}
      >
        <Button
          theme={this.props.screenProps.device.theme}
          title={getText("sort")}
          onPress={() => this.openActionSheet()}
          icon="filter"
          font="FontAwesome"
          style={{ marginTop: 20, marginHorizontal: 10 }}
        />

        <View
          style={{
            flexDirection: "row",
            borderRadius: 20,
            backgroundColor: this.props.screenProps.device.theme.secondary,
            marginVertical: 20,
            marginHorizontal: 10,
            paddingHorizontal: 20,
            height: 40,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder={getText("search")}
            placeholderTextColor={
              this.props.screenProps.device.theme.secondaryTextSoft
            }
            value={search}
            style={{
              flex: 1,
              fontSize: 16,
              color: this.props.screenProps.device.theme.secondaryText,
            }}
            onChangeText={(search) => this.setState({ search })}
          />

          <Icon.FontAwesome
            name="search"
            size={20}
            color={this.props.screenProps.device.theme.secondaryText}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: 40,
            backgroundColor: this.props.screenProps.device.theme.secondary,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <T style={{ fontWeight: "bold" }}>{getText("name")}</T>
          <T style={{ fontWeight: "bold" }}>{this.state.orderBy.title}</T>
        </View>
      </View>
    );
  };
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { members, search } = this.state;

    const searchedMembers = members.filter((m) =>
      search ? m.name?.toLowerCase().includes(search.toLowerCase()) : true
    );
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{
            height: Platform.OS === "web" ? 0 : undefined,
          }}
          ItemSeparatorComponent={() => <Separator />}
          ListHeaderComponent={this.renderHeader}
          data={searchedMembers}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

export default connectActionSheet(Members);
