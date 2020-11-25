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
  NativeModules,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import T from "../components/T";
import { leftMenu, rightMenu } from "../Menus";
import { getTextFunction, post } from "../Util";

const { width, height } = Dimensions.get("window");
const itemWidth = width / 4 > 100 ? 100 : width / 4;
const isSmallDevice = width < 800;

const amountOfItems = Math.floor((height - 200) / itemWidth) * 4;

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
    this.sendLanguage();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      this.turnOnNotifications();
      this.sendLanguage();
    }
  };

  sendLanguage = () => {
    const { device, me } = this.props.screenProps;

    const locale =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : Platform.OS === "android"
        ? NativeModules.I18nManager.localeIdentifier
        : Platform.OS === "web"
        ? navigator.language
        : null;

    // console.log("locale", locale);
    if (locale !== me?.locale) {
      post("updateProfile", {
        locale,
        loginToken: device.loginToken,
      });
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
            <View
              key={`i${index}`}
              style={{ width: itemWidth, alignItems: "center" }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#000",
                  backgroundColor: theme.secondary,
                  borderRadius: 10,
                  width: itemWidth - 25,
                  height: itemWidth - 25,
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
                    size={(itemWidth - 25) / 2}
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
      ...leftMenu(me, device.theme).reduce(
        (previous, current) => [...previous, ...current.content],
        []
      ),
      ...rightMenu(me, device.theme).reduce(
        (previous, current) => [...previous, ...current.content],
        []
      ),
    ];
    const filtered = menus.filter((menu) => !menu.isHeader && !menu.isStats);

    const getText = getTextFunction(me?.locale);

    const data = [
      filtered.slice(0, amountOfItems),
      filtered.slice(amountOfItems, amountOfItems * 2),
      amountOfItems * 2 > filtered.length
        ? undefined
        : filtered.slice(amountOfItems * 2, filtered.length),
    ].filter((x) => !!x);

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
              <T>{getText("turnOnNotificationsText")}</T>
            </View>
          </TouchableOpacity>
        )}

        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          data={data}
          renderItem={this._renderItem}
          sliderWidth={width}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
          itemWidth={width}
        />

        <Pagination
          dotsLength={data.length}
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
    const {
      device,
      device: { theme },
      me,
    } = this.props.screenProps;

    const getText = getTextFunction(me?.locale);

    const menus = [
      ...leftMenu(me, device.theme).reduce(
        (previous, current) => [...previous, ...current.content],
        []
      ),
      ...rightMenu(me, device.theme).reduce(
        (previous, current) => [...previous, ...current.content],
        []
      ),
    ];
    const filtered = menus.filter((menu) => !menu.isHeader && !menu.isStats);

    if (Platform.OS === "web") {
      if (isSmallDevice) {
        return <ScrollView>{this._renderItem({ item: filtered })}</ScrollView>;
      } else {
        return <T>{getText("welcomeBack")}</T>;
      }
    }
    return this.renderCarousel();
  }
}

export default Home;
