import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { createBrowserApp } from "@react-navigation/web";
import * as React from "react";
import {
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
import { Colors } from "./Colors";
import Dead from "./components/Dead";
import Fly from "./components/Fly";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Jail from "./components/Jail";
import { leftMenu, rightMenu } from "./Menus";
import Accomplice from "./screens/Accomplice";
import AdminEmail from "./screens/AdminEmail";
import Airport from "./screens/Airport";
import Backfire from "./screens/Backfire";
import Bank from "./screens/Bank";
import Bulletfactory from "./screens/Bulletfactory";
import Bunker from "./screens/Bunker";
import Casino from "./screens/Casino";
import ChangeName from "./screens/ChangeName";
import ChangePassword from "./screens/ChangePassword";
import Chat from "./screens/Chat";
import Contribute from "./screens/Contribute";
import Creditshop from "./screens/Creditshop";
import Crimes from "./screens/Crimes";
import Donate from "./screens/Donate";
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
import Members from "./screens/Members";
import Messages from "./screens/Messages";
import Mollie from "./screens/Mollie";
import MollieComplete from "./screens/MollieComplete";
import MyProfile from "./screens/MyProfile";
import Notifications from "./screens/Notifications";
import OrganisedCrime from "./screens/OrganisedCrime";
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
import VerifyPhone from "./screens/VerifyPhone";
import VerifyPhoneCode from "./screens/VerifyPhoneCode";
import Wiet from "./screens/Wiet";
import { persistor, store } from "./Store";
import { useExpoUpdate } from "./updateHook";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

export const renderMenu = (item, index, navigation) => {
  const isHeaderStyle = item.isHeader
    ? {
        marginTop: 20,
        backgroundColor: "#444",
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
            color: "white",
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

export const renderDrawerMenu = (item, index, navigation) => {
  const isHeaderStyle = item.isHeader
    ? {
        marginTop: 20,
        backgroundColor: "#CCC",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopWidth: 1,
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
  const { me, device } = screenProps;

  const updateAvailable = useExpoUpdate();
  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        height: "100%",
        backgroundColor: Colors.secondary,
      }}
    >
      {isSmallDevice ? null : (
        <View style={{ width: 200 }}>
          {leftMenu(me).map((item, index) =>
            renderMenu(item, index, navigation)
          )}
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Header navigation={navigation} device={device} me={me} />

        {me?.phoneVerified === false && (
          <TouchableOpacity
            style={{
              margin: 15,
              padding: 15,
              backgroundColor: Colors.primary,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate("VerifyPhone")}
          >
            <Text>
              Je account is nog niet geverifieerd! Klik hier om dat te doen
            </Text>
          </TouchableOpacity>
        )}

        {updateAvailable && (
          <TouchableOpacity
            onPress={() => Updates.reloadAsync()}
            style={{
              margin: 15,
              padding: 15,
              backgroundColor: Colors.primary,
              borderRadius: 5,
            }}
          >
            <Text>
              Er is een nieuwe update beschikbaar. Klik hier om de app te
              verversen.
            </Text>
          </TouchableOpacity>
        )}

        {me?.reizenAt > Date.now() ? (
          <Fly screenProps={screenProps} navigation={navigation} />
        ) : me?.health <= 0 || me?.health === null ? (
          <Dead screenProps={screenProps} navigation={navigation} />
        ) : me?.jailAt > Date.now() ? (
          <Jail screenProps={screenProps} navigation={navigation} />
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
        {Platform.OS === "web" && <Footer />}
      </View>
      {isSmallDevice ? null : (
        <View style={{ width: 200 }}>
          {rightMenu(me).map((item, index) =>
            renderMenu(item, index, navigation)
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
    screenProps: { me },
  } = props;

  return (
    <ScrollView>
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        {leftMenu(me).map((item, index) =>
          renderDrawerMenu(item, index, navigation)
        )}
        {rightMenu(me).map((item, index) =>
          renderDrawerMenu(item, index, navigation)
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
      Crimes: withLayout(Crimes),
      Jail: withLayout(JailScreen),
      Kill: withLayout(Kill),
      Rob: withLayout(Rob),
      // Showroom: withLayout(Showroom),
      Bank: withLayout(Bank),
      Shop: withLayout(Shop),
      Garage: withLayout(Garage),
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
      Notifications: withLayout(Notifications),
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
        headerHideShadow: true,
        headerStyle: {
          backgroundColor: Colors.primary,
          shadowOffset: { height: 0, width: 0 },
        },
      },
    }
  ),
  {
    history: "hash",
  }
);

class _RootContainer extends React.Component {
  componentDidMount() {
    const { device, reloadMe, dispatch } = this.props;

    let token = device.loginToken;
    if (!token) {
      token = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
      dispatch({ type: "SET_LOGIN_TOKEN", value: token });
    }

    reloadMe(token);
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

const mapStateToProps = ({ device, me }) => {
  //console.log("State gets mapped to props... device only");
  return { device, me };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  reloadMe: (loginToken) =>
    dispatch({ type: "ME_FETCH_REQUESTED", payload: { loginToken } }),
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
