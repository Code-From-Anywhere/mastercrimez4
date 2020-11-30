import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as Icon from "@expo/vector-icons";
import { createBrowserApp } from "@react-navigation/web";
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
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { connect, Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { AlertProvider } from "./components/AlertProvider";
import ConnectionProvider from "./components/ConnectionProvider";
import Dead from "./components/Dead";
import Fly from "./components/Fly";
import Header from "./components/Header";
import Hoverable from "./components/Hoverable";
import {
  IntervalContext,
  IntervalProvider,
} from "./components/IntervalProvider";
import Jail from "./components/Jail";
// import { loadReCaptcha } from "react-recaptcha-v3";
import LoginModal from "./components/LoginModal";
import T from "./components/T";
import { KeyboardAvoidingSpace } from "./KeyboardAvoidingSpace";
import { leftMenu, rightMenu } from "./Menus";
import Accomplice from "./screens/Accomplice";
import AdminEmail from "./screens/AdminEmail";
import AdminUserWatch from "./screens/AdminUserWatch";
import Airport from "./screens/Airport";
import AllBanks from "./screens/AllBanks";
import Backfire from "./screens/Backfire";
import Bank from "./screens/Bank";
import Bomb from "./screens/Bomb";
import Bulletfactory from "./screens/Bulletfactory";
import Bunker from "./screens/Bunker";
import Casino from "./screens/Casino";
import ChangeName from "./screens/ChangeName";
import ChangePassword from "./screens/ChangePassword";
import Channel from "./screens/Channel";
import Channels from "./screens/Channels";
import Chat from "./screens/Chat";
import ChooseProfession from "./screens/ChooseProfession";
import Code from "./screens/Code";
import Contribute from "./screens/Contribute";
import CreateOc from "./screens/CreateOC";
import CreateStreetrace from "./screens/CreateStreetrace";
import Crimes from "./screens/Crimes";
import Donate from "./screens/Donate";
import DownloadApp from "./screens/DownloadApp";
import ForgotPassword from "./screens/ForgotPassword";
import Forum from "./screens/Forum";
import Gang from "./screens/Gang";
import GangAchievements from "./screens/GangAchievements";
import GangBulletFactory from "./screens/GangBulletFactory";
import GangCreate from "./screens/GangCreate";
import GangMissions from "./screens/GangMissions";
import Gangs from "./screens/Gangs";
import GangSettings from "./screens/GangSettings";
import GangShop from "./screens/GangShop";
import Garage from "./screens/Garage";
import Gym from "./screens/Gym";
import Hackers from "./screens/Hackers";
import Hoeren from "./screens/Hoeren";
import Home from "./screens/Home";
import Hospital from "./screens/Hospital";
import Income from "./screens/Income";
import Info from "./screens/Info";
import InfoGame from "./screens/InfoGame";
import InfoRules from "./screens/InfoRules";
import JailScreen from "./screens/Jail";
import Junkies from "./screens/Junkies";
import Kill from "./screens/Kill";
import Login from "./screens/Login";
import Lotto from "./screens/Lotto";
import ManageObject from "./screens/ManageObject";
import Market from "./screens/Market";
import Members from "./screens/Members";
import MollieComplete from "./screens/MollieComplete";
import MyObjects from "./screens/MyObjects";
import MyProfile from "./screens/MyProfile";
import OC from "./screens/OC";
import Poker from "./screens/Poker";
import Police from "./screens/Police";
import Privacy from "./screens/Privacy";
import Prizes from "./screens/Prizes";
import Profile from "./screens/Profile";
import Racecars from "./screens/Racecars";
import RecoverPassword from "./screens/RecoverPassword";
import Rob from "./screens/Rob";
import Settings from "./screens/Settings";
import Shop from "./screens/Shop";
import SignupEmail from "./screens/SignupEmail";
import SignupEmail2 from "./screens/SignupEmail2";
import Sint from "./screens/Sint";
import Stats from "./screens/Stats";
import Status from "./screens/Status";
import StealCar from "./screens/StealCar";
import Streetrace from "./screens/Streetrace";
import SwissBank from "./screens/SwissBank";
import Theme from "./screens/Theme";
import VerifyPhone from "./screens/VerifyPhone";
import VerifyPhoneCode from "./screens/VerifyPhoneCode";
import VIP from "./screens/VIP";
import Wiet from "./screens/Wiet";
import Work from "./screens/Work";
import { persistor, store } from "./Store";
import { darkerHex, doOnce, getTextFunction, lighterHex } from "./Util";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 800;

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

const Layout = ({ screenProps, navigation, children }) => {
  const { me, device, dispatch, reloadMe } = screenProps;

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
          height: Platform.OS === "web" ? height - 250 : undefined,
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
          height: Platform.OS === "web" ? height - 250 : undefined,
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

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
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
            height: Platform.OS === "web" ? height : undefined,
            flex: 1,
          }}
        >
          <Header navigation={navigation} device={device} me={me} />

          {me?.reizenAt > Date.now() && !skip ? (
            <Fly screenProps={screenProps} navigation={navigation} />
          ) : (me?.health <= 0 || me?.health === null) && !skip ? (
            <Dead screenProps={screenProps} navigation={navigation} />
          ) : me?.jailAt > Date.now() && !skip ? (
            <Jail screenProps={screenProps} navigation={navigation} />
          ) : (
            <View style={{ flex: 1 }}>{children}</View>
          )}
          {Platform.OS === "ios" && <KeyboardAvoidingSpace />}
        </View>

        {isSmallDevice ? null : renderRightMenu()}
      </SafeAreaView>

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

const CustomDrawerContentComponent = (props) => {
  const {
    navigation,
    screenProps: { me, device, dispatch },
  } = props;

  const [leftActive, setLeftActive] = useState(device.menu?.left);
  const [rightActive, setRightActive] = useState(device.menu?.right);

  return (
    <ScrollView>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: device.theme.primary }}
        forceInset={{ top: "always", horizontal: "never" }}
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
      </SafeAreaView>
    </ScrollView>
  );
};

const rightContainer =
  Platform.OS === "web" ? createBrowserApp : createAppContainer;
const rightNavigator =
  Platform.OS === "web"
    ? isSmallDevice
      ? createDrawerNavigator
      : createSwitchNavigator
    : createStackNavigator;

const Container = rightContainer(
  rightNavigator(
    {
      Home: {
        screen: withLayout(Home),
        path: "",
      },

      GangCreate: withLayout(GangCreate),

      Gang: {
        screen: withLayout(Gang),
        path: "Gang/:name",
      },

      Gangs: withLayout(Gangs),
      GangShop: withLayout(GangShop),
      GangSettings: withLayout(GangSettings),
      GangAchievements: withLayout(GangAchievements),
      GangMissions: withLayout(GangMissions),
      GangBulletFactory: withLayout(GangBulletFactory),

      Status: withLayout(Status),
      Hackers: withLayout(Hackers),
      Police: withLayout(Police),
      StealCar: withLayout(StealCar),
      CreateStreetrace: withLayout(CreateStreetrace),
      Channels: withLayout(Channels),
      Channel: withLayout(Channel),
      AllBanks: withLayout(AllBanks),
      Poker: withLayout(Poker),
      Lotto: withLayout(Lotto),
      Bomb: withLayout(Bomb),
      SwissBank: withLayout(SwissBank),

      Crimes: withLayout(Crimes),
      Jail: withLayout(JailScreen),
      Kill: withLayout(Kill),
      Rob: withLayout(Rob),
      // Showroom: withLayout(Showroom),
      Bank: withLayout(Bank),
      Shop: withLayout(Shop),
      Garage: withLayout(Garage),
      ManageObject: withLayout(ManageObject),
      MyObjects: withLayout(MyObjects),
      Racecars: withLayout(Racecars),
      Backfire: withLayout(Backfire),
      Accomplice: withLayout(Accomplice),
      Streetrace: withLayout(Streetrace),
      Bulletfactory: withLayout(Bulletfactory),
      Casino: withLayout(Casino),
      Airport: withLayout(Airport),
      Members: withLayout(Members),
      Stats: withLayout(Stats),
      Chat: withLayout(Chat),
      Gym: withLayout(Gym),
      Wiet: withLayout(Wiet),
      MollieComplete: withLayout(MollieComplete),
      Junkies: withLayout(Junkies),
      Hoeren: withLayout(Hoeren),
      Bunker: withLayout(Bunker),
      Donate: withLayout(Donate),
      Hospital: withLayout(Hospital),
      Income: withLayout(Income),
      AdminEmail: withLayout(AdminEmail),
      AdminUserWatch: withLayout(AdminUserWatch),
      Forum: withLayout(Forum),
      Theme: withLayout(Theme),
      DownloadApp: DownloadApp,
      VIP: withLayout(VIP),
      Market: withLayout(Market),
      Sint: withLayout(Sint),
      ChooseProfession: withLayout(ChooseProfession),
      Profile: {
        screen: withLayout(Profile),
        path: "Profile/:name",
      },

      //SETTINGS
      Settings: withLayout(Settings),
      SignupEmail: withLayout(SignupEmail),

      SignupEmail2: {
        screen: withLayout(SignupEmail2),
        path: "SignupEmail2/:token",
      },

      ChangeName: withLayout(ChangeName),
      VerifyPhoneCode: withLayout(VerifyPhoneCode),
      ForgotPassword: withLayout(ForgotPassword),
      RecoverPassword: {
        screen: withLayout(RecoverPassword),
        path: "RecoverPassword/:token",
      },

      Code: {
        screen: withLayout(Code),
        path: "Code/:code",
      },
      Case: {
        screen: withLayout(Code),
        path: "Case/:code",
      },
      Car: {
        screen: withLayout(Code),
        path: "Car/:code",
      },

      ChangePassword: {
        screen: withLayout(ChangePassword),
      },
      VerifyPhone: withLayout(VerifyPhone),
      MyProfile: withLayout(MyProfile),
      Login: withLayout(Login),
      Work: withLayout(Work),
      OC: withLayout(OC),
      CreateOc: withLayout(CreateOc),

      //INFO
      Info: withLayout(Info),
      InfoGame: withLayout(InfoGame),
      InfoRules: withLayout(InfoRules),
      Privacy: withLayout(Privacy),
      Contribute: withLayout(Contribute),
      Prizes: withLayout(Prizes),
    },
    {
      drawerPosition: "right",
      edgeWidth: Platform.OS === "web" && isSmallDevice ? 0 : undefined,
      contentComponent: CustomDrawerContentComponent,
      unmountInactiveRoutes: true,
      navigationOptions: {
        drawerLockMode: "locked-open",
      },
      defaultNavigationOptions: {
        headerShown: false,
      },
    }
  ),
  {
    history: "hash",
  }
);

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

const _RootContainer = (props) => {
  // NB: we got screenProps here , but not navigation
  // if you also need navigation, use withLayout/Layout
  return (
    <AlertProvider>
      <IntervalProvider screenProps={{ ...props }}>
        <ActionSheetProvider>
          <ConnectionProvider>
            <Container screenProps={{ ...props }} />
          </ConnectionProvider>
        </ActionSheetProvider>
      </IntervalProvider>
    </AlertProvider>
  );
};

const mapStateToProps = ({ device, me, streetraces, ocs, cities }) => {
  //console.log("State gets mapped to props... device only");
  return { device, me, streetraces, ocs, cities };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  reloadMe: (loginToken) => {
    //console.log("reloadMe with loginToken", loginToken);
    dispatch({ type: "ME_FETCH_REQUESTED", payload: { loginToken } });
  },
  reloadStreetraces: () =>
    dispatch({ type: "STREETRACES_FETCH_REQUESTED", payload: null }),
  reloadOcs: (token) =>
    dispatch({ type: "OCS_FETCH_REQUESTED", payload: { token } }),
  reloadCities: () =>
    dispatch({ type: "CITIES_FETCH_REQUESTED", payload: null }),
});

const RootContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(_RootContainer);

const App = () => {
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <RootContainer />
      </Provider>
    </PersistGate>
  );
};
export default App;
