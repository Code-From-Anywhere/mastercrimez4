import * as Icon from "@expo/vector-icons";
import * as ExpoNotifications from "expo-notifications";
import * as StoreReview from "expo-store-review";
import * as React from "react";
import { useEffect, useState } from "react";
import Helmet from "react-helmet";
import {
  AppState,
  Dimensions,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import Dead from "./components/Dead";
import Header from "./components/Header";
import Hoverable from "./components/Hoverable";
import { IntervalContext } from "./components/IntervalProvider";
// import { loadReCaptcha } from "react-recaptcha-v3";
import LoginModal from "./components/LoginModal";
import T from "./components/T";
import { KeyboardAvoidingSpace } from "./KeyboardAvoidingSpace";
import { leftMenu, rightMenu } from "./Menus";
import { darkerHex, doOnce, getTextFunction, lighterHex } from "./Util";

const useNewContainer = Platform.OS === "ios" && __DEV__;

export const renderMenu = (
  item,
  index,
  navigation,
  theme: Theme,
  dispatch,
  me
) => {
  const TheIcon = Icon[item.iconType];

  const isCurrent = navigation.state.routeName === item.to;
  const TouchOrView = item.isHeader ? View : TouchableOpacity;
  const getText = getTextFunction(me?.locale);
  return (
    <TouchOrView
      key={`item${index}`}
      onPress={(e) => {
        if (item.to) {
          navigation.navigate(item.to, item.params);

          const movement = {
            action: "Web_Menu_" + item.to,
            locationX: e.nativeEvent.locationX,
            locationY: e.nativeEvent.locationY,
            timestamp: Date.now(),
          };

          dispatch({ type: "ADD_MOVEMENT", value: movement });
        }
      }}
    >
      <Hoverable onHoverIn={null} onHoverOut={null}>
        {(isHovered) => (
          <View
            style={{
              borderBottomWidth: 0,
              padding: 3,
              backgroundColor: item.isHeader
                ? theme.primary
                : darkerHex(theme.primary),
              paddingLeft: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                minHeight: 25,
                backgroundColor:
                  isHovered || isCurrent
                    ? lighterHex(theme.primary)
                    : undefined,
                borderRadius: isHovered || isCurrent ? 15 : undefined,
              }}
            >
              <View style={{ width: 30, alignItems: "center" }}>
                {TheIcon ? (
                  <TheIcon
                    name={item.icon}
                    size={20}
                    color={theme.secondaryText}
                  />
                ) : item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                ) : null}
              </View>
              <Text
                style={{
                  marginLeft: 15,
                  color: theme.primaryText,
                  fontWeight: item.isHeader ? "bold" : undefined,
                }}
              >
                {item.text}
              </Text>
              {item.isNew && (
                <View
                  style={{
                    marginLeft: 10,
                    // backgroundColor: "red",
                    borderRadius: 10,
                    borderColor: theme.primaryText,
                    borderWidth: 1,
                    padding: 3,
                  }}
                >
                  <T>{getText("new")}</T>
                </View>
              )}

              {item.label && (
                <View
                  style={{
                    marginLeft: 10,
                    // backgroundColor: "red",
                    borderRadius: 10,
                    borderColor: theme.primaryText,
                    borderWidth: 1,
                    padding: 3,
                  }}
                >
                  <T>{item.label}</T>
                </View>
              )}
              {item.component}
            </View>
          </View>
        )}
      </Hoverable>
    </TouchOrView>
  );
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const Layout = ({ screenProps, navigation, children }) => {
  const { me, device, dispatch, reloadMe } = screenProps;

  const window = Dimensions.get("window");
  const isSmallDevice = window.width < 800;

  const { resetIntervalsForToken } = React.useContext(IntervalContext);

  doOnce(() => {
    let token = device.loginToken;

    if (!token || token.length < 64) {
      token = makeid(64);
      dispatch({ type: "SET_LOGIN_TOKEN", value: token });

      resetIntervalsForToken(token);
      reloadMe(token);
    } else {
      reloadMe(token);
    }

    Linking.addEventListener("url", openWebUrl);
    Linking.getInitialURL().then((url) => openWebUrl(url));
  });

  const openWebUrl = (url) => {
    console.log("should open web url here", url);
  };

  useEffect(() => {
    reloadMe(device.loginToken);
  }, [device.logged]);

  const getText = getTextFunction(me?.locale);

  const [leftActive, setLeftActive] = useState(device.menu?.left);
  const [rightActive, setRightActive] = useState(device.menu?.right);

  const _handleNotificationResponse = ({
    notification: {
      request: {
        content: { data },
      },
    },
  }) => {
    //TODO: Fix dat hij naar chat redirect
    // navigation.navigate("Channels", { id: data.body.id });
  };

  const handleChange = (nextAppState) => {
    if (nextAppState === "active") {
      // somehow this doesn't work properly
      // screenProps.reloadMe(screenProps.device.loginToken);

      screenProps.dispatch({ type: "INCREASE_FOREGROUNDED" });

      if (screenProps.device.foregrounded > 3) {
        StoreReview.isAvailableAsync().then((available) => {
          // console.log("avaiable", available);
          if (available) {
            StoreReview.requestReview();
          }
        });
      }
    }
  };
  useEffect(() => {
    ExpoNotifications.addNotificationResponseReceivedListener(
      _handleNotificationResponse
    );
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", handleChange);

    return () => {
      AppState.removeEventListener("change", handleChange);
    };
  }, []);

  const allowedRoutes = [
    "Home",
    "Settings",
    "Members",
    "Profile",
    "Status",
    "Stats",
    "MyObjects",
    "Chat",
    "Channels",
    "Channel",
    "Forum",
    "Info",
    "InfoGame",
    "InfoRules",
    "Privacy",
    "Contribute",
    "Prizes",
    "Notifications",
    "VerifyPhone",
    "ChangePassword",
    "SignupEmail",
    "ChangeName",
    "Theme",
    "Login",
    "MyProfile",
    "Backfire",
    "Accomplice",
    "Gangs",
    "Gang",
    "GangSettings",
    "GangAchievements",
    "Market",
  ];
  const skip = allowedRoutes.includes(navigation.state.routeName);

  const renderForWeb = () => (
    <Helmet>
      <title>MasterCrimeZ - The Ultimate Game</title>
      <meta name="description" content={getText("metaDescription")} />

      <meta property="og:url" content="https://mastercrimez.com/" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={getText("metaOgTitle")} />
      <meta property="og:description" content={getText("metaOgDescription")} />
      <meta property="og:image" content="" />
    </Helmet>
  );

  const renderLeftMenu = () => (
    <View style={{ width: 200 }}>
      <ScrollView
        style={{ width: 200 }}
        contentContainerStyle={{
          width: 200,
          height: Platform.OS === "web" ? window.height - 250 : undefined,
        }}
      >
        <Accordion
          expandMultiple
          sections={leftMenu(me, device.theme)}
          activeSections={leftActive}
          onChange={(active) => {
            setLeftActive(active);
            dispatch({
              type: "MENU_SET_LEFT_ACTIVE_SECTIONS",
              value: active,
            });
          }}
          renderHeader={(section, index) =>
            renderMenu(
              section.header,
              index,
              navigation,
              device.theme,
              dispatch,
              me
            )
          }
          renderContent={(section) =>
            section.content.map((item, index) =>
              renderMenu(item, index, navigation, device.theme, dispatch, me)
            )
          }
        />
      </ScrollView>
    </View>
  );

  const renderRightMenu = () => (
    <View style={{ width: 200 }}>
      <ScrollView
        style={{ width: 200 }}
        contentContainerStyle={{
          width: 200,
          height: Platform.OS === "web" ? window.height - 250 : undefined,
        }}
      >
        <Accordion
          expandMultiple
          sections={rightMenu(me, device.theme)}
          activeSections={rightActive}
          onChange={(active) => {
            setRightActive(active);
            dispatch({
              type: "MENU_SET_RIGHT_ACTIVE_SECTIONS",
              value: active,
            });
          }}
          renderHeader={(section, index) =>
            renderMenu(
              section.header,
              index,
              navigation,
              device.theme,
              dispatch,
              me
            )
          }
          renderContent={(section) =>
            section.content.map((item, index) =>
              renderMenu(item, index, navigation, device.theme, dispatch, me)
            )
          }
        />
      </ScrollView>
    </View>
  );

  const SafeOrView = useNewContainer ? View : SafeAreaView;
  return (
    <View style={{ flex: 1 }}>
      <SafeOrView
        style={{
          flexDirection: "row",
          flex: 1,
          backgroundColor: device.theme.primary,
        }}
      >
        {Platform.OS === "web" && renderForWeb()}
        {isSmallDevice ? null : renderLeftMenu()}

        <View
          style={{
            height: Platform.OS === "web" ? window.height : undefined,
            flex: 1,
          }}
        >
          {(!useNewContainer ||
            (useNewContainer && navigation.state.routeName !== "Map")) && (
            <Header navigation={navigation} device={device} me={me} />
          )}

          {(me?.health <= 0 || me?.health === null) && !skip ? (
            <Dead screenProps={screenProps} navigation={navigation} />
          ) : (
            <View style={{ flex: 1 }}>{children}</View>
          )}
          {Platform.OS === "ios" && navigation.state.routeName !== "Map" && (
            <KeyboardAvoidingSpace offset={useNewContainer ? 65 : 0} />
          )}
        </View>

        {isSmallDevice ? null : renderRightMenu()}
      </SafeOrView>

      {!device.logged && (
        <LoginModal navigation={navigation} screenProps={screenProps} />
      )}
    </View>
  );
};
export const withLayout = (Component) => (props) => (
  <Layout {...props}>
    <Component {...props} />
  </Layout>
);
