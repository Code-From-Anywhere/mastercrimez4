import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as Icon from "@expo/vector-icons";
import { createBrowserApp } from "@react-navigation/web";
import * as React from "react";
import { useState } from "react";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { connect, Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { AlertProvider } from "./components/AlertProvider";
import ConnectionProvider from "./components/ConnectionProvider";
import { IntervalProvider } from "./components/IntervalProvider";
import { withLayout } from "./Layout";
import { leftMenu, rightMenu } from "./Menus";
import Accomplice from "./screens/Accomplice";
import AdminEmail from "./screens/AdminEmail";
import AdminUserWatch from "./screens/AdminUserWatch";
import AirplaneShop from "./screens/AirplaneShop";
import Airport from "./screens/Airport";
import AllAirport from "./screens/AllAirport";
import AllBanks from "./screens/AllBanks";
import AllBulletfactory from "./screens/AllBulletfactory";
import AllGang from "./screens/AllGang";
import AllGarage from "./screens/AllGarage";
import AllStats from "./screens/AllStats";
import Backfire from "./screens/Backfire";
import Bank from "./screens/Bank";
import Blocks from "./screens/Blocks";
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
import CreateRobbery from "./screens/CreateRobbery";
import CreateStreetrace from "./screens/CreateStreetrace";
import Crimes from "./screens/Crimes";
import Detectives from "./screens/Detectives";
import Donate from "./screens/Donate";
import DownloadApp from "./screens/DownloadApp";
import EstateAgent from "./screens/EstateAgent";
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
import GarageShop from "./screens/GarageShop";
import Gym from "./screens/Gym";
import Hackers from "./screens/Hackers";
import Hoeren from "./screens/Hoeren";
import Home from "./screens/Home";
import Hospital from "./screens/Hospital";
import House from "./screens/House";
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
import Map from "./screens/Map/Map";
import Market from "./screens/Market";
import Members from "./screens/Members";
import MollieComplete from "./screens/MollieComplete";
import More from "./screens/More";
import MyObjects from "./screens/MyObjects";
import MyProfile from "./screens/MyProfile";
import OC from "./screens/OC";
import Poker from "./screens/Poker";
import Police from "./screens/Police";
import Privacy from "./screens/Privacy";
import Prizes from "./screens/Prizes";
import Profile from "./screens/Profile";
import ProtectionShop from "./screens/ProtectionShop";
import Racecars from "./screens/Racecars";
import RecoverPassword from "./screens/RecoverPassword";
import Reports from "./screens/Reports";
import Rob from "./screens/Rob";
import Robbery from "./screens/Robbery";
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
import WeaponShop from "./screens/WeaponShop";
import Wiet from "./screens/Wiet";
import Work from "./screens/Work";
import { persistor, store } from "./Store";
import { getTextFunction } from "./Util";

const useNewContainer = Platform.OS === "ios" && __DEV__;

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

const window = Dimensions.get("window");
const isSmallDevice = window.width < 800;

const rightNavigator =
  Platform.OS === "web"
    ? isSmallDevice
      ? createDrawerNavigator
      : createSwitchNavigator
    : createStackNavigator;

const routes = {
  Home: {
    screen: withLayout(Home),
    path: "",
  },

  GangCreate: withLayout(GangCreate),
  AllGang: withLayout(AllGang),

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
  AllBulletfactory: withLayout(AllBulletfactory),

  Robbery: withLayout(Robbery),
  CreateRobbery: withLayout(CreateRobbery),

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
  Detectives: withLayout(Detectives),
  SwissBank: withLayout(SwissBank),

  Crimes: withLayout(Crimes),
  Jail: withLayout(JailScreen),
  Kill: withLayout(Kill),
  Rob: withLayout(Rob),
  // Showroom: withLayout(Showroom),
  Bank: withLayout(Bank),
  Shop: withLayout(Shop),
  Garage: withLayout(Garage),
  GarageShop: withLayout(GarageShop),
  WeaponShop: withLayout(WeaponShop),
  ProtectionShop: withLayout(ProtectionShop),

  AllGarage: withLayout(AllGarage),
  ManageObject: withLayout(ManageObject),
  MyObjects: withLayout(MyObjects),
  Racecars: withLayout(Racecars),
  Backfire: withLayout(Backfire),
  Accomplice: withLayout(Accomplice),
  Streetrace: withLayout(Streetrace),
  Bulletfactory: withLayout(Bulletfactory),
  Casino: withLayout(Casino),
  Airport: withLayout(Airport),
  AllAirport: withLayout(AllAirport),
  Members: withLayout(Members),
  Stats: withLayout(Stats),
  Chat: withLayout(Chat),
  Gym: withLayout(Gym),
  Wiet: withLayout(Wiet),
  MollieComplete: withLayout(MollieComplete),
  Junkies: withLayout(Junkies),
  Hoeren: withLayout(Hoeren),
  Bunker: withLayout(Bunker),
  House: withLayout(House),
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
  Blocks: withLayout(Blocks),
  Reports: withLayout(Reports),
  Map: withLayout(Map),
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

  AirplaneShop: withLayout(AirplaneShop),
  EstateAgent: withLayout(EstateAgent),
  //INFO
  Info: withLayout(Info),
  InfoGame: withLayout(InfoGame),
  InfoRules: withLayout(InfoRules),
  Privacy: withLayout(Privacy),
  Contribute: withLayout(Contribute),
  Prizes: withLayout(Prizes),
  AllStats: withLayout(AllStats),
  More: withLayout(More),
};

const tabRoutes = {
  Map: createStackNavigator(routes, {
    initialRouteName: "Map",
    headerMode: "none",
  }),
  Stats: createStackNavigator(routes, {
    initialRouteName: "AllStats",
    headerMode: "none",
  }),
  Channels: createStackNavigator(routes, {
    initialRouteName: "Channels",
    headerMode: "none",
  }),
  More: createStackNavigator(routes, {
    initialRouteName: "More",
    headerMode: "none",
  }),
};

const NewContainer = createAppContainer(
  createBottomTabNavigator(tabRoutes, {
    defaultNavigationOptions: ({ navigation, screenProps: { me } }) => {
      const getText = getTextFunction(me?.locale);
      const routeName = navigation.state.routeName;

      return {
        title:
          routeName === "Map"
            ? getText("menuMap")
            : routeName === "More"
            ? getText("menuMore")
            : routeName === "Channels"
            ? getText("menuChat")
            : getText("menuStats"),

        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Icon.FontAwesome;
          let badgeCount = 0;
          let iconName;
          if (routeName === "Map") {
            iconName = focused ? "map" : "map-o";
          } else if (routeName === "More") {
            iconName = "dots-three-horizontal";
            IconComponent = Icon.Entypo;
          } else if (routeName === "Stats") {
            iconName = "bar-graph";
            IconComponent = Icon.Entypo;
          } else {
            // hoe krijgen we hier de aantal nieuwe chats?
            iconName = "ios-chatbubbles";
            IconComponent = Icon.Ionicons;
            badgeCount = me?.chats;
          }

          // You can return any component that you like here!
          return (
            <View>
              <IconComponent name={iconName} size={25} color={tintColor} />
              {badgeCount > 0 && (
                <View
                  style={{
                    backgroundColor: "red",
                    borderRadius: 6,
                    minWidth: 12,
                    height: 12,
                    position: "absolute",
                    right: -6,
                    top: -3,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 2,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                  >
                    {badgeCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
      };
    },
    tabBarOptions: {
      keyboardHidesTabBar: false, //on ios keyboard goes over tabbar anyway, and if you hide it, the map moves a bit.
      activeTintColor: "tomato",
      inactiveTintColor: "gray",
    },
  })
);
const OldContainer = rightContainer(
  rightNavigator(routes, {
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
  }),
  {
    history: "hash",
  }
);

const _RootContainer = (props) => {
  // NB: we got screenProps here , but not navigation
  // if you also need navigation, use withLayout/Layout

  const Container = useNewContainer ? NewContainer : OldContainer;
  return (
    <IntervalProvider screenProps={{ ...props }}>
      <ActionSheetProvider>
        <ConnectionProvider>
          <AlertProvider>
            <Container screenProps={{ ...props }} />
          </AlertProvider>
        </ConnectionProvider>
      </ActionSheetProvider>
    </IntervalProvider>
  );
};

const mapStateToProps = ({
  device,
  me,
  streetraces,
  ocs,
  cities,
  robberies,
}) => {
  //console.log("State gets mapped to props... device only");
  return { device, me, streetraces, ocs, cities, robberies };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
  reloadMe: (loginToken) => {
    //console.log("reloadMe with loginToken", loginToken);
    dispatch({ type: "ME_FETCH_REQUESTED", payload: { loginToken } });
  },
  reloadStreetraces: () =>
    dispatch({ type: "STREETRACES_FETCH_REQUESTED", payload: null }),
  reloadRobberies: () =>
    dispatch({ type: "ROBBERIES_FETCH_REQUESTED", payload: null }),
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
