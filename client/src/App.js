import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { createBrowserApp } from "@react-navigation/web";
import * as ExpoNotifications from "expo-notifications";
import * as StoreReview from "expo-store-review";
import * as React from "react";
import { useEffect } from "react";
import Helmet from "react-helmet";
import {
  AppState,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
// import { loadReCaptcha } from "react-recaptcha-v3";
import { connect, Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import Dead from "./components/Dead";
import Fly from "./components/Fly";
import Header from "./components/Header";
import Jail from "./components/Jail";
import Constants from "./Constants";
import { KeyboardAvoidingSpace } from "./KeyboardAvoidingSpace";
import { leftMenu, rightMenu } from "./Menus";
import Accomplice from "./screens/Accomplice";
import AdminEmail from "./screens/AdminEmail";
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
import Contribute from "./screens/Contribute";
import CreateStreetrace from "./screens/CreateStreetrace";
import Creditshop from "./screens/Creditshop";
import Crimes from "./screens/Crimes";
import Donate from "./screens/Donate";
import DownloadApp from "./screens/DownloadApp";
import ForgotPassword from "./screens/ForgotPassword";
import Forum from "./screens/Forum";
import Garage from "./screens/Garage";
import Gym from "./screens/Gym";
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
import ManageObject from "./screens/ManageObject";
import Members from "./screens/Members";
import Messages from "./screens/Messages";
import Mollie from "./screens/Mollie";
import MollieComplete from "./screens/MollieComplete";
import MyObjects from "./screens/MyObjects";
import MyProfile from "./screens/MyProfile";
import OrganisedCrime from "./screens/OrganisedCrime";
import Poker from "./screens/Poker";
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
import Stats from "./screens/Stats";
import Status from "./screens/Status";
import StealCar from "./screens/StealCar";
import Streetrace from "./screens/Streetrace";
import SuperMessage from "./screens/SuperMessage";
import SwissBank from "./screens/SwissBank";
import Theme from "./screens/Theme";
import VerifyPhone from "./screens/VerifyPhone";
import VerifyPhoneCode from "./screens/VerifyPhoneCode";
import Wiet from "./screens/Wiet";
import { persistor, store } from "./Store";
import { post } from "./Util";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "windows";
  }

  if (/android/i.test(userAgent)) {
    return "android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPhone|iPod/.test(userAgent) && !window.MSStream) {
    //iPad|
    return "ios";
  }

  return "unknown";
}

export const renderMenu = (item, index, navigation, theme: Theme) => {
  const isHeaderStyle = item.isHeader
    ? {
        marginTop: 20,
        backgroundColor: theme.secondary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: "black",
        borderRightColor: "black",
        borderTopColor: "black",
        padding: 10,
      }
    : {};
  return (
    <TouchableOpacity
      key={`item${index}`}
      onPress={() => {
        if (item.to) {
          navigation.navigate(item.to, item.params);
        }
      }}
    >
      <View
        style={{
          borderLeftColor: "black",
          borderRightColor: "black",
          borderBottomColor: "black",
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: "black",
          borderRightColor: "black",

          borderBottomWidth: 1,
          marginHorizontal: 5,
          padding: 3,
          flexDirection: "row",
          ...isHeaderStyle,
        }}
      >
        <Text
          style={{
            color: item.isHeader ? theme.secondaryText : theme.primaryText,
            textAlign: item.isHeader ? "center" : undefined,
          }}
        >
          {item.text}
        </Text>
        {item.component}
      </View>
    </TouchableOpacity>
  );
};

export const renderDrawerMenu = (item, index, navigation, theme) => {
  const isHeaderStyle = item.isHeader
    ? {
        marginTop: 20,
        backgroundColor: theme.secondary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopWidth: 1,
        borderTopColor: "black",
        padding: 10,
      }
    : { backgroundColor: theme.primary };
  return (
    <TouchableOpacity
      key={`item${index}`}
      onPress={() => {
        if (item.to) {
          navigation.navigate(item.to, item.params);
        }
      }}
    >
      <View
        style={{
          borderLeftColor: "black",
          borderRightColor: "black",
          borderBottomColor: "black",
          borderBottomWidth: 1,
          marginHorizontal: 5,
          flexDirection: "row",
          padding: 20,
          ...isHeaderStyle,
        }}
      >
        <Text
          style={{
            textAlign: item.isHeader ? "center" : undefined,
            color: item.isHeader ? theme.secondaryText : theme.primaryText,
          }}
        >
          {item.text}
        </Text>
        {item.component}
      </View>
    </TouchableOpacity>
  );
};

const Layout = ({ screenProps, navigation, children }) => {
  const _handleNotificationResponse = ({
    notification: {
      request: {
        content: { data },
      },
    },
  }) => {
    console.log("Wadup", data);

    navigation.navigate("Messages", { id: data.body.id });
  };

  const handleChange = (nextAppState) => {
    if (nextAppState === "active") {
      screenProps.reloadMe(screenProps.device.loginToken);

      screenProps.dispatch({ type: "INCREASE_FOREGROUNDED" });

      if (screenProps.device.foregrounded > 3) {
        StoreReview.isAvailableAsync().then((available) => {
          console.log("avaiable", available);
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

  const { me, device } = screenProps;

  if (Platform.OS === "web") {
    if (getMobileOperatingSystem() === "android") {
      console.log("is android");
      window.location.replace(Constants.ANDROID_APP_URL);
    }

    if (getMobileOperatingSystem() === "ios") {
      console.log("is ios");
      window.location.replace(Constants.IOS_APP_URL);
    }
  }

  const allowedRoutes = [
    "Home",
    "Settings",
    "Members",
    "Profile",
    "Status",
    "Stats",
    "MyObjects",
    "Chat",
    "Messages",
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
  ];
  const skip = allowedRoutes.includes(navigation.state.routeName);
  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        height: "100%",
        backgroundColor: device.theme.primary,
      }}
    >
      {Platform.OS === "web" && (
        <Helmet>
          <title>MasterCrimeZ - The Ultimate Game</title>
          <meta name="description" content="Word jij de beste gangster?" />

          <meta property="og:url" content="https://mastercrimez.nl/" />
          <meta property="og:type" content="article" />
          <meta
            property="og:title"
            content="MasterCrimeZ - The Ultimate Game"
          />
          <meta
            property="og:description"
            content="Word jij de beste gangster?"
          />
          <meta property="og:image" content="" />
        </Helmet>
      )}
      {isSmallDevice ? null : (
        <View style={{ width: 200 }}>
          {leftMenu(me, device.theme).map((item, index) =>
            renderMenu(item, index, navigation, device.theme)
          )}
        </View>
      )}

      <View style={{ flex: 1 }}>
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
      {isSmallDevice ? null : (
        <View style={{ width: 200 }}>
          {rightMenu(me, device.theme).map((item, index) =>
            renderMenu(item, index, navigation, device.theme)
          )}
        </View>
      )}
    </SafeAreaView>
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
    screenProps: { me, device },
  } = props;

  return (
    <ScrollView>
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        {leftMenu(me, device.theme).map((item, index) =>
          renderDrawerMenu(item, index, navigation, device.theme)
        )}
        {rightMenu(me, device.theme).map((item, index) =>
          renderDrawerMenu(item, index, navigation, device.theme)
        )}
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
      Status: withLayout(Status),
      StealCar: withLayout(StealCar),
      CreateStreetrace: withLayout(CreateStreetrace),
      Channels: withLayout(Channels),
      Channel: withLayout(Channel),
      AllBanks: withLayout(AllBanks),
      Poker: withLayout(Poker),
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
      Messages: withLayout(Messages),
      Chat: withLayout(Chat),
      Gym: withLayout(Gym),
      Wiet: withLayout(Wiet),
      Creditshop: withLayout(Creditshop),
      MollieComplete: withLayout(MollieComplete),
      OrganisedCrime: withLayout(OrganisedCrime),
      Junkies: withLayout(Junkies),
      Hoeren: withLayout(Hoeren),
      Bunker: withLayout(Bunker),
      Donate: withLayout(Donate),
      Hospital: withLayout(Hospital),
      Income: withLayout(Income),
      AdminEmail: withLayout(AdminEmail),
      Forum: withLayout(Forum),
      Theme: withLayout(Theme),
      DownloadApp: DownloadApp,

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
      SuperMessage: withLayout(SuperMessage),
      ForgotPassword: withLayout(ForgotPassword),
      RecoverPassword: {
        screen: withLayout(RecoverPassword),
        path: "RecoverPassword/:token",
      },
      ChangePassword: {
        screen: withLayout(ChangePassword),
      },
      VerifyPhone: withLayout(VerifyPhone),
      MyProfile: withLayout(MyProfile),
      Login: withLayout(Login),

      //INFO
      Info: withLayout(Info),
      InfoGame: withLayout(InfoGame),
      InfoRules: withLayout(InfoRules),
      Privacy: withLayout(Privacy),
      Contribute: withLayout(Contribute),
      Prizes: withLayout(Prizes),
      Mollie: withLayout(Mollie),
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

class _RootContainer extends React.Component {
  async componentDidMount() {
    const { device, reloadMe, dispatch } = this.props;

    let token = device.loginToken;
    //
    if (!token) {
      token = makeid(64);
      dispatch({ type: "SET_LOGIN_TOKEN", value: token });
    }

    reloadMe(token);

    if (Platform.OS !== "web") {
      setInterval(() => this.sendMovements(), 60000);
    }
  }

  sendMovements() {
    const { dispatch, device } = this.props;
    post("movementsApp", {
      loginToken: device.loginToken,
      movements: device.movements,
    });
    dispatch({ type: "CLEAR_MOVEMENTS" });
  }

  componentDidUpdate(prevProps) {
    const { reloadMe, device } = this.props;
    //if login or logout happens
    if (prevProps.device.logged !== this.props.device.logged) {
      reloadMe(device.loginToken);
    }
  }

  render() {
    const { props } = this;

    return (
      <ActionSheetProvider>
        <Container screenProps={{ ...props }} />
      </ActionSheetProvider>
    );
  }
}

const mapStateToProps = ({ device, me, streetraces, cities }) => {
  //console.log("State gets mapped to props... device only");
  return { device, me, streetraces, cities };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  reloadMe: (loginToken) =>
    dispatch({ type: "ME_FETCH_REQUESTED", payload: { loginToken } }),
  reloadStreetraces: () =>
    dispatch({ type: "STREETRACES_FETCH_REQUESTED", payload: null }),
  reloadCities: () =>
    dispatch({ type: "CITIES_FETCH_REQUESTED", payload: null }),
});

const RootContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(_RootContainer);

export default class App extends React.Component {
  render() {
    return (
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <RootContainer />
        </Provider>
      </PersistGate>
    );
  }
}
