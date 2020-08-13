import { connectActionSheet } from "@expo/react-native-action-sheet";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Icon from "react-native-vector-icons";
import { Colors } from "../Colors";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { getRank, getStrength } from "../Util";
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
  state = {
    members: [],
    search: null,
    orderBy: {
      key: "onlineAt",
      title: "Online",
    },
  };

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
          height: 40,
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile", { name: item.name });
          }}
        >
          <T>{item.name}</T>
        </TouchableOpacity>
        <T>{secondKey}</T>
      </View>
    );
  };

  openActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = orders.map((o) => o.title);

    options.push("Annuleren");
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
    const { members, search } = this.state;

    return (
      <View style={{ backgroundColor: "#444" }}>
        <Button
          title="Sorteer"
          onPress={() => this.openActionSheet()}
          icon="filter"
          font="FontAwesome"
          style={{ marginTop: 20, marginHorizontal: 10 }}
        />

        <View
          style={{
            flexDirection: "row",
            borderRadius: 20,
            backgroundColor: Colors.primary,
            marginVertical: 20,
            marginHorizontal: 10,
            paddingHorizontal: 20,
            height: 40,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Zoeken"
            value={search}
            style={{ flex: 1, fontSize: 16, color: Colors.primaryText }}
            onChangeText={(search) => this.setState({ search })}
          />

          <Icon.FontAwesome
            name="search"
            size={20}
            color={Colors.primaryText}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: 40,
            backgroundColor: "#444",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <T style={{ fontWeight: "bold" }}>Naam</T>
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
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          contentContainerStyle={{
            borderColor: "black",
            borderWidth: 1,
            height: Platform.OS === "web" ? height - 200 : undefined,
          }}
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
