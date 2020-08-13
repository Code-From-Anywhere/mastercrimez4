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
import { leftMenu, rightMenu } from "../Menus";
const { width } = Dimensions.get("window");

class Home extends Component {
  state = {
    response: null,
  };

  _renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    const {
      screenProps: {
        device: { theme },
      },
    } = this.props;
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
        {item.map((menu, index) => {
          const TheIcon = Icon[menu.iconType];
          return (
            <View key={`i${index}`} style={{ width: 90, alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#000",
                  backgroundColor: theme.secondary,
                  borderRadius: 10,
                  width: 70,
                  height: 70,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate(menu.to)}
              >
                {TheIcon && (
                  <TheIcon
                    name={menu.icon}
                    size={40}
                    color={theme.secondaryText}
                  />
                )}
              </TouchableOpacity>
              <View>
                <Text style={{ color: theme.primaryText }}>{menu.text}</Text>
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
      screenProps: { me, device },
    } = this.props;

    const menus = [
      ...leftMenu(me, device.theme),
      ...rightMenu(me, device.theme),
    ];
    const filtered = menus.filter((menu) => !menu.isHeader && !menu.isStats);

    return (
      <Carousel
        ref={(c) => {
          this._carousel = c;
        }}
        data={[
          filtered.slice(0, 16),
          filtered.slice(16, 32),
          filtered.slice(32, filtered.length),
        ]}
        renderItem={this._renderItem}
        sliderWidth={width}
        itemWidth={width}
      />
    );
  }
  render() {
    const { theme } = this.props.screenProps.device;
    if (Platform.OS === "web") {
      return <Text style={{ color: theme.primaryText }}>Welkom terug</Text>;
    }
    return this.renderCarousel();
  }
}

export default Home;
