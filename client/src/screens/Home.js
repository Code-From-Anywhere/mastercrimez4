import * as Icon from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import ExpoConstants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import React, { Component } from "react";
import {
  AppState,
  Dimensions,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import T from "../components/T";
import { leftMenu, rightMenu } from "../Menus";
import { post } from "../Util";

const { width } = Dimensions.get("window");

class Home extends Component {
  state = {
    response: null,
    activeSlide: 0,
    notificationsHeader: false,
  };

  async componentDidMount() {
    const { device } = this.props.screenProps;

    AppState.addEventListener("change", this._handleAppStateChange);

    this.turnOnNotifications();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      this.turnOnNotifications();
    }
  };

  turnOnNotifications = async () => {
    const { device, me } = this.props.screenProps;
    if (ExpoConstants.isDevice && Platform.OS !== "web") {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        this.setState({ notificationsHeader: true });

        if (me?.pushtoken !== "") {
          post("updateProfile", {
            pushtoken: "",
            loginToken: device.loginToken,
          });
        }

        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      if (token !== me?.pushtoken) {
        post("updateProfile", {
          pushtoken: token,
          loginToken: device.loginToken,
        });
      }
      this.setState({ notificationsHeader: false });
    }
  };

  _renderItem = ({ item, index }) => {
    const {
      navigation,
      screenProps: {
        dispatch,
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
                onPress={(e) => {
                  navigation.navigate(menu.to);

                  const movement = {
                    action: "App_Menu_" + menu.to,
                    locationX: e.nativeEvent.locationX,
                    locationY: e.nativeEvent.locationY,
                    timestamp: Date.now(),
                  };

                  dispatch({ type: "ADD_MOVEMENT", value: movement });
                }}
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
      screenProps: { dispatch, me, device },
    } = this.props;

    const { notificationsHeader } = this.state;

    const menus = [
      ...leftMenu(me, device.theme),
      ...rightMenu(me, device.theme),
    ];
    const filtered = menus.filter((menu) => !menu.isHeader && !menu.isStats);

    return (
      <View style={{ flex: 1 }}>
        {notificationsHeader && (
          <TouchableOpacity
            onPress={() => {
              Platform.OS === "ios"
                ? Linking.openURL("app-settings:")
                : IntentLauncher.startActivityAsync(
                    IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS
                  );
            }}
          >
            <View
              style={{
                padding: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="exclamationcircleo"
                color="red"
                style={{ marginRight: 10 }}
              />
              <T>
                Zet je notificaties aan zodat je van alles op de hoogte blijft!
              </T>
            </View>
          </TouchableOpacity>
        )}

        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          data={[filtered.slice(0, 16), filtered.slice(16, filtered.length)]}
          renderItem={this._renderItem}
          sliderWidth={width}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
          itemWidth={width}
        />

        <Pagination
          dotsLength={2}
          activeDotIndex={this.state.activeSlide}
          // containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 8,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
          }}
          inactiveDotStyle={
            {
              // Define styles for inactive dots here
            }
          }
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    );
  }
  render() {
    const { theme } = this.props.screenProps.device;
    if (Platform.OS === "web") {
      const handleMouseMove = (event) => {
        var x = event.clientX;
        var y = event.clientY;
        var coor = "X coords: " + x + ", Y coords: " + y;
        console.log("coor", coor);
      };

      document.onmousemove = handleMouseMove;

      return <Text style={{ color: theme.primaryText }}>Welkom terug</Text>;
    }
    return this.renderCarousel();
  }
}

export default Home;
