import * as Icon from "@expo/vector-icons";
import React, { Component } from "react";
import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { Colors } from "../Colors";
import { leftMenu, rightMenu } from "../Menus";
const { width } = Dimensions.get("window");

class Status extends Component {
  state = {
    response: null,
  };

  _renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          marginVertical: 15,
        }}
      >
        {item.map((menu) => {
          const TheIcon = Icon[menu.iconType];
          return (
            <View style={{ width: 90, alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#000",
                  backgroundColor: Colors.primary,
                  borderRadius: 10,
                  width: 80,
                  height: 80,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate(menu.to)}
              >
                {TheIcon && <TheIcon name={menu.icon} size={40} />}
              </TouchableOpacity>
              <View>
                <Text style={{ color: "#FFF" }}>{menu.text}</Text>
                {menu.component}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  renderCarousel() {
    const {
      screenProps: { me },
    } = this.props;

    const menus = [...leftMenu(me), ...rightMenu(me)];
    const filtered = menus.filter((menu) => !menu.isHeader && !menu.isStats);

    return (
      <Carousel
        ref={(c) => {
          this._carousel = c;
        }}
        data={[filtered.slice(0, 16), filtered.slice(16, filtered.length)]}
        renderItem={this._renderItem}
        sliderWidth={width}
        itemWidth={width}
      />
    );
  }
  render() {
    if (Platform.OS === "web") {
      return <Text>Welkom terug</Text>;
    }
    return this.renderCarousel();
  }
}

export default Status;
