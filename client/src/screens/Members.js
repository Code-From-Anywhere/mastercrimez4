import { connectActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import { Dimensions, FlatList, Platform, TextInput, View } from "react-native";
import * as Icon from "react-native-vector-icons";
import Button from "../components/Button";
import Separator from "../components/Separator";
import T from "../components/T";
import User from "../components/User";
import Constants from "../Constants";
import { doOnce, getRank, getStrength, getTextFunction } from "../Util";
const { height } = Dimensions.get("window");

const filters = [
  {
    key: "alive",
    title: "Levend",
  },
  {
    key: "dead",
    title: "Dood",
  },
  {
    key: "crew",
    title: "Crew",
  },
];

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

const Members = ({
  showActionSheetWithOptions,
  navigation,
  navigation: {
    state: { params },
  },
  screenProps: { me, device },
}) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState(orders[0]);
  const [filter, setFilter] = useState(filters[0]);
  const getText = getTextFunction(me?.locale);

  doOnce(() => {
    const order = params?.order;
    if (order) {
      setOrderBy(orders[order]);
      fetchMembers(orders[order].key);
    } else {
      fetchMembers(orderBy.key);
    }
  });

  const fetchMembers = (order, filter) => {
    fetch(`${Constants.SERVER_ADDR}/members?order=${order}&filter=${filter}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (members) => {
        setMembers(members);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderItem = ({ item, index }) => {
    const orderKey = orderBy.key;

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

  const openActionSheetSort = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = orders.map((o) => o.title);

    options.push(getText("cancel"));
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: null,
      },
      (buttonIndex) => {
        if (buttonIndex < options.length - 1) {
          setOrderBy(orders[buttonIndex]);
          fetchMembers(orders[buttonIndex].key, filter.key);
        }
        // Do something here depending on the button index selected
      }
    );
  };

  const openActionSheetFilter = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = filters.map((o) => o.title);

    options.push(getText("cancel"));
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: null,
      },
      (buttonIndex) => {
        if (buttonIndex < filters.length) {
          console.log("setfilter", filters[buttonIndex]);
          setFilter(filters[buttonIndex]);
          fetchMembers(orders[buttonIndex].key, filters[buttonIndex].key);
        }
        // Do something here depending on the button index selected
      }
    );
  };

  const renderHeader = () => {
    return (
      <View style={{ backgroundColor: device.theme.primary }}>
        <View style={{ flexDirection: "row" }}>
          <Button
            title={getText("sort")}
            onPress={() => openActionSheetSort()}
            icon="filter"
            font="FontAwesome"
            style={{ marginTop: 20, marginHorizontal: 10 }}
          />

          <Button
            title={getText("filter")}
            onPress={() => openActionSheetFilter()}
            icon="filter"
            font="FontAwesome"
            style={{ marginTop: 20, marginHorizontal: 10 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            borderRadius: 20,
            backgroundColor: device.theme.secondary,
            marginVertical: 20,
            marginHorizontal: 10,
            paddingHorizontal: 20,
            height: 40,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder={getText("search")}
            placeholderTextColor={device.theme.secondaryTextSoft}
            value={search}
            style={{
              flex: 1,
              fontSize: 16,
              color: device.theme.secondaryText,
            }}
            onChangeText={setSearch}
          />

          <Icon.FontAwesome
            name="search"
            size={20}
            color={device.theme.secondaryText}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: 40,
            backgroundColor: device.theme.secondary,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <T style={{ fontWeight: "bold" }}>{getText("name")}</T>
          <T style={{ fontWeight: "bold" }}>{orderBy.title}</T>
        </View>
      </View>
    );
  };

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
        ListHeaderComponent={renderHeader}
        data={searchedMembers}
        renderItem={renderItem}
      />
    </View>
  );
};

export default connectActionSheet(Members);
