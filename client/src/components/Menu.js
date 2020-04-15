import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import * as Icon from "react-native-vector-icons";

import T from "../components/T";

const Menu = ({ navigation, title, to, onPress }) => (
  <TouchableOpacity
    onPress={() => (onPress ? onPress() : navigation.navigate(to))}
  >
    <View
      style={{
        height: 40,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "black",
      }}
    >
      <T>{title}</T>
      <Icon.FontAwesome name="caret-right" size={24} color="white" />
    </View>
  </TouchableOpacity>
);

export default Menu;
