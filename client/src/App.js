import * as React from "react";
import {
  Platform,
  Dimensions,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { screens } from "expo-inputs";
import CountDown from "react-native-countdown-component";
import { loadReCaptcha } from "react-recaptcha-v3";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { createBrowserApp } from "@react-navigation/web";

import { PersistGate } from "redux-persist/es/integration/react";
import { connect, Provider } from "react-redux";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { persistor, store } from "./Store";
import { getRank } from "./Util";
import Constants from "./Constants";

import Fly from "./components/Fly";
import Dead from "./components/Dead";
import Jail from "./components/Jail";

//screens
import Showroom from "./screens/Showroom";
import Status from "./screens/Status";
import Members from "./screens/Members";
import Stats from "./screens/Stats";
import Messages from "./screens/Messages";
import StealCar from "./screens/StealCar";
import Crimes from "./screens/Crimes";
import Kill from "./screens/Kill";
import Rob from "./screens/Rob";
import Bank from "./screens/Bank";
import Shop from "./screens/Shop";
import Garage from "./screens/Garage";
import Streetrace from "./screens/Streetrace";
import Bulletfactory from "./screens/Bulletfactory";
import Casino from "./screens/Casino";
import Airport from "./screens/Airport";
import Gym from "./screens/Gym";
import Wiet from "./screens/Wiet";
import Junkies from "./screens/Junkies";
import Hoeren from "./screens/Hoeren";
import Bunker from "./screens/Bunker";
import Income from "./screens/Income";
import Donate from "./screens/Donate";
import AdminEmail from "./screens/AdminEmail";
import Forum from "./screens/Forum";
import Hospital from "./screens/Hospital";

import Privacy from "./screens/Privacy";
import Login from "./screens/Login";
import SignupEmail from "./screens/SignupEmail";
import SignupEmail2 from "./screens/SignupEmail2";
import RecoverPassword from "./screens/RecoverPassword";
import ChangePassword from "./screens/ChangePassword";
import ForgotPassword from "./screens/ForgotPassword";
import ChangeName from "./screens/ChangeName";
import Contribute from "./screens/Contribute";
import Chat from "./screens/Chat";
import Settings from "./screens/Settings";
import Info from "./screens/Info";
import InfoGame from "./screens/InfoGame";
import InfoRules from "./screens/InfoRules";
import Prizes from "./screens/Prizes";

import MyProfile from "./screens/MyProfile";
import Profile from "./screens/Profile";

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
        backgroundColor: "darkblue",
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

const leftMenu = (me) => {
  const stealcarSeconds = Math.ceil(
    (me?.autostelenAt + 60000 - Date.now()) / 1000
  );

  const crimeSeconds = Math.ceil((me?.crimeAt + 60000 - Date.now()) / 1000);

  const attackSeconds = Math.ceil((me?.attackAt + 120000 - Date.now()) / 1000);

  const robSeconds = Math.ceil((me?.robAt + 30000 - Date.now()) / 1000);

  const gymSeconds = Math.ceil((me?.gymAt + me?.gymTime - Date.now()) / 1000);
  const wietSeconds = Math.ceil((me?.wietAt + 120000 - Date.now()) / 1000);
  const junkiesSeconds = Math.ceil(
    (me?.junkiesAt + 120000 - Date.now()) / 1000
  );
  const hoerenSeconds = Math.ceil((me?.hoerenAt + 120000 - Date.now()) / 1000);
  return [
    {
      isHeader: true,
      text: "Misdaden",
    },

    {
      text: "Auto Stelen",
      to: "StealCar",
      component:
        stealcarSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={stealcarSeconds}
            digitStyle={{ backgroundColor: "#404040" }}
            digitTxtStyle={{ color: "white" }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      text: "Misdaden",
      to: "Crimes",
      component:
        crimeSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={crimeSeconds}
            digitStyle={{ backgroundColor: "#404040" }}
            digitTxtStyle={{ color: "white" }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },
    {
      text: "Aanvallen",
      to: "Kill",
      component:
        attackSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={attackSeconds}
            digitStyle={{ backgroundColor: "#404040" }}
            digitTxtStyle={{ color: "white" }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },
    {
      text: "Beroven",
      to: "Rob",
      component:
        robSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={robSeconds}
            digitStyle={{ backgroundColor: "#404040" }}
            digitTxtStyle={{ color: "white" }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },
    {
      text: "Sportschool",
      to: "Gym",
      component:
        gymSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={gymSeconds}
            digitStyle={{ backgroundColor: "#404040" }}
            digitTxtStyle={{ color: "white" }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      text: "Wietplantage",
      to: "Wiet",
      component:
        wietSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={wietSeconds}
            digitStyle={{ backgroundColor: "#404040" }}
            digitTxtStyle={{ color: "white" }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      text: "Junkies",
      to: "Junkies",
      component:
        junkiesSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={junkiesSeconds}
            digitStyle={{ backgroundColor: "#404040" }}
            digitTxtStyle={{ color: "white" }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      text: "Hoeren",
      to: "Hoeren",
      component:
        hoerenSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={hoerenSeconds}
            digitStyle={{ backgroundColor: "#404040" }}
            digitTxtStyle={{ color: "white" }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      isHeader: true,
      text: "Uitgeven",
    },
    {
      text: "Bank",
      to: "Bank",
    },

    {
      text: "Schuilkelder",
      to: "Bunker",
    },

    {
      text: "Ziekenhuis",
      to: "Hospital",
    },

    {
      text: "Winkel",
      to: "Shop",
    },
    {
      text: "Showroom",
      to: "Showroom",
    },
    {
      text: "Garage",
      to: "Garage",
    },
    {
      text: "Streetrace",
      to: "Streetrace",
    },
    // {
    //   text: "Kogelfabriek",
    //   to: "Bulletfactory"
    // },
    // {
    //   text: "Casino",
    //   to: "Casino"
    // },
    {
      text: "Vliegveld",
      to: "Airport",
    },
  ];
};

const adminMenu = (me) =>
  me?.level > 1
    ? [
        {
          isHeader: true,
          text: "Admin panel",
        },

        {
          text: "Emailen",
          to: "AdminEmail",
        },
      ]
    : [];

const rightMenu = (me) => [
  {
    isHeader: true,
    text: me?.name,
    to: "Profile",
    params: { name: me?.name },
  },

  {
    text: "Contant: " + me?.cash,
  },

  {
    text: "Bank: " + me?.bank,
  },
  {
    text: "Kogels: " + me?.bullets,
  },
  {
    text: "Rank: " + getRank(me?.rank, "both"),
  },
  {
    text: "Health: " + me?.health + "%",
  },
  {
    text: "Stad: " + me?.city,
  },

  {
    isHeader: true,
    text: "Maatschappij",
  },
  {
    text: "Status",
    to: "Status",
  },

  {
    text: "Leden",
    to: "Members",
  },

  {
    text: "Statistieken",
    to: "Stats",
  },

  {
    text: "Doneren",
    to: "Donate",
  },

  {
    text: "Inkomen",
    to: "Income",
  },

  // {
  //   text: "Statistieken",
  //   to: "Stats"
  // },

  {
    isHeader: true,
    text: "Algemeen",
  },

  {
    text: `Berichten (${me?.messages})`,
    to: "Messages",
  },

  {
    text: "Forum",
    to: "Forum",
  },

  {
    text: "Instellingen",
    to: "Settings",
  },

  {
    text: "Informatie",
    to: "Info",
  },

  {
    text: "Draag bij",
    to: "Contribute",
  },
  {
    text: "Prijzen",
    to: "Prizes",
  },

  ...adminMenu(me),
];

class Layout extends React.Component {
  componentDidMount() {
    loadReCaptcha(Constants.CAPTCHA);
  }

  render() {
    const { screenProps, navigation, children } = this.props;

    const { me, device } = screenProps;

    return (
      <SafeAreaView
        style={{
          flexDirection: "row",
          height: "100%",
          backgroundColor: "#555",
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
          <Header navigation={navigation} device={device} />
          {me?.reizenAt > Date.now() ? (
            <Fly screenProps={screenProps} navigation={navigation} />
          ) : me?.health === 0 || me?.health === null ? (
            <Dead screenProps={screenProps} navigation={navigation} />
          ) : me?.jailAt > Date.now() ? (
            <Jail screenProps={screenProps} navigation={navigation} />
          ) : (
            <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
          )}
          <Footer />
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
  }
}

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
const rightNavigator = isSmallDevice
  ? createDrawerNavigator
  : createSwitchNavigator;

const Container = rightContainer(
  rightNavigator(
    {
      Status: {
        screen: withLayout(Status),
        path: "",
      },
      StealCar: withLayout(StealCar),
      Crimes: withLayout(Crimes),
      Kill: withLayout(Kill),
      Rob: withLayout(Rob),
      Showroom: withLayout(Showroom),
      Bank: withLayout(Bank),
      Shop: withLayout(Shop),
      Garage: withLayout(Garage),
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
      ForgotPassword: withLayout(ForgotPassword),
      RecoverPassword: {
        screen: withLayout(RecoverPassword),
        path: "RecoverPassword/:token",
      },
      ChangePassword: {
        screen: withLayout(ChangePassword),
      },
      MyProfile: withLayout(MyProfile),
      Login: withLayout(Login),

      //INFO
      Info: withLayout(Info),
      InfoGame: withLayout(InfoGame),
      InfoRules: withLayout(InfoRules),
      Privacy: withLayout(Privacy),
      Contribute: withLayout(Contribute),
      Prizes: withLayout(Prizes),
      ...screens,
    },
    {
      drawerPosition: "right",
      edgeWidth: Platform.OS === "web" && isSmallDevice ? 0 : undefined,
      contentComponent: CustomDrawerContentComponent,
      unmountInactiveRoutes: true,
      navigationOptions: {
        drawerLockMode: "locked-open",
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
      token = Math.round(Math.random() * 1000000000);
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
