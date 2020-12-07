import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Icon from "@expo/vector-icons";
import moment from "moment";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CountDown from "react-native-countdown-component";
import { Col, Grid } from "react-native-easy-grid";
import Swiper from "react-native-web-swiper";
import { useSelector } from "react-redux";
import { AlertContext } from "../../components/AlertProvider";
import User from "../../components/User";
import {
  getRank,
  getTextFunction,
  numberFormat,
  post,
  withCaptcha,
} from "../../Util";
import Accomplice from "../Accomplice";
import AdminEmail from "../AdminEmail";
import AdminUserWatch from "../AdminUserWatch";
import AirplaneShop from "../AirplaneShop";
import Airport from "../Airport";
import AllAirport from "../AllAirport";
import AllBanks from "../AllBanks";
import AllBulletfactory from "../AllBulletfactory";
import AllGang from "../AllGang";
import AllGarage from "../AllGarage";
import AllStats from "../AllStats";
import Backfire from "../Backfire";
import Bank from "../Bank";
import Blocks from "../Blocks";
import Bomb from "../Bomb";
import Bulletfactory from "../Bulletfactory";
import Bunker from "../Bunker";
import Casino from "../Casino";
import ChangeName from "../ChangeName";
import ChangePassword from "../ChangePassword";
import Channel from "../Channel";
import Channels from "../Channels";
import Chat from "../Chat";
import ChooseProfession from "../ChooseProfession";
import Code from "../Code";
import Contribute from "../Contribute";
import CreateOc from "../CreateOC";
import CreateRobbery from "../CreateRobbery";
import CreateStreetrace from "../CreateStreetrace";
import Crimes from "../Crimes";
import Detectives from "../Detectives";
import Donate from "../Donate";
import DownloadApp from "../DownloadApp";
import EstateAgent from "../EstateAgent";
import ForgotPassword from "../ForgotPassword";
import Forum from "../Forum";
import Gang from "../Gang";
import GangAchievements from "../GangAchievements";
import GangBulletFactory from "../GangBulletFactory";
import GangCreate from "../GangCreate";
import GangMissions from "../GangMissions";
import Gangs from "../Gangs";
import GangSettings from "../GangSettings";
import GangShop from "../GangShop";
import Garage from "../Garage";
import GarageShop from "../GarageShop";
import Gym from "../Gym";
import Hackers from "../Hackers";
import Hoeren from "../Hoeren";
import Home from "../Home";
import Hospital from "../Hospital";
import House from "../House";
import Income from "../Income";
import Info from "../Info";
import InfoGame from "../InfoGame";
import InfoRules from "../InfoRules";
import JailScreen from "../Jail";
import Junkies from "../Junkies";
import Kill from "../Kill";
import Login from "../Login";
import Lotto from "../Lotto";
import ManageObject from "../ManageObject";
import Market from "../Market";
import Members from "../Members";
import MollieComplete from "../MollieComplete";
import More from "../More";
import MyObjects from "../MyObjects";
import MyProfile from "../MyProfile";
import OC from "../OC";
import Poker from "../Poker";
import Police from "../Police";
import Privacy from "../Privacy";
import Prizes from "../Prizes";
import Profile from "../Profile";
import Properties from "../Properties";
import ProtectionShop from "../ProtectionShop";
import Racecars from "../Racecars";
import RecoverPassword from "../RecoverPassword";
import Reports from "../Reports";
import Rob from "../Rob";
import Robbery from "../Robbery";
import Settings from "../Settings";
import Shop from "../Shop";
import SignupEmail from "../SignupEmail";
import SignupEmail2 from "../SignupEmail2";
import Sint from "../Sint";
import StatsScreen from "../Stats";
import Status from "../Status";
import StealCar from "../StealCar";
import Streetrace from "../Streetrace";
import SwissBank from "../SwissBank";
import Theme from "../Theme";
import VerifyPhone from "../VerifyPhone";
import VerifyPhoneCode from "../VerifyPhoneCode";
import VIP from "../VIP";
import WeaponShop from "../WeaponShop";
import Wiet from "../Wiet";
import Work from "../Work";

const Modal = ({ view, navigation, setView, children }) => {
  const theme = useSelector((state) => state.device.theme);
  return (
    <View
      style={{
        position: "absolute",
        top: view === "territories" ? 180 : view === "game" ? 130 : 110,
        bottom: view === "chat" ? 70 : 140,
        left: 5,
        right: 5,
        backgroundColor: `${theme.primary}CC`,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {navigation.state.history.length > 1 ? (
          <TouchableOpacity
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon.AntDesign
              name="arrowleft"
              size={32}
              color={theme.secondaryText}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          onPress={() => {
            if (view !== "game" && view !== "territories" && view !== "crime") {
              setView("game");
            }

            navigation.popToTop();
          }}
        >
          <Icon.AntDesign name="close" size={32} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};
export const getZoom = (delta) => Math.ceil(Math.log(360 / delta) / Math.LN2);
const Stats = React.memo(({ me, device }) => {
  const textStyle = {
    marginRight: 10,
    marginBottom: 10,
    color: "white",
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={textStyle}>
        {me?.name} {me?.gang?.name}
      </Text>
      <Text style={textStyle}>❤️ {me?.health}%</Text>

      <Text style={textStyle}>💰 €{numberFormat(me?.cash)},-</Text>
      <Text style={textStyle}>💵 €{numberFormat(me?.bank)},-</Text>
      <View style={{ flexDirection: "row" }}>
        <Icon.MaterialCommunityIcons
          name="pistol"
          size={18}
          color={device.theme.secondaryText}
          style={{ marginRight: 5 }}
        />
        <Text style={textStyle}>{numberFormat(me?.bullets)}</Text>
      </View>
      <Text style={textStyle}>🔥 {me?.gamepoints}</Text>
      <Text style={textStyle}>
        ⭐️ {getRank(me?.rank, "both")} ({me?.position}e)
      </Text>
    </View>
  );
});

const MapIcon = React.memo(({ view }) => {
  return (
    <TouchableOpacity
      key={`v${view.view}`}
      hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      style={{
        marginBottom: 10,
        backgroundColor: view.isActive ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.4)",
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={view.onPress}
    >
      <view.icon name={view.iconName} color="white" size={30} />
    </TouchableOpacity>
  );
});

const Screen = ({ navigation, screenProps }) => {
  const screen = navigation.state.routeName;

  const screens = {
    Stats: StatsScreen,
    Channels,
    More,
    Profile,
    Members,
    Gangs,
    Prizes,
    Properties,
    Settings,
    Info,
    Police,
    VIP,
    Accomplice,
    AdminEmail,
    AdminUserWatch,
    AirplaneShop,
    Airport,
    AllAirport,
    AllBanks,
    AllBulletfactory,
    AllGang,
    AllGarage,
    AllStats,
    Backfire,
    Bank,
    Blocks,
    Bulletfactory,
    Bunker,
    Casino,
    ChangeName,
    ChangePassword,
    Channel,
    Chat,
    ChooseProfession,
    Code,
    Contribute,
    CreateOc,
    CreateRobbery,
    CreateStreetrace,
    Crimes,
    Detectives,
    Donate,
    DownloadApp,
    EstateAgent,
    ForgotPassword,
    Bomb,
    Forum,
    Gang,
    GangAchievements,
    GangBulletFactory,
    GangCreate,
    GangMissions,
    GangSettings,
    GangShop,
    Garage,
    GarageShop,
    Gym,
    Hackers,
    Hoeren,
    Home,
    Hospital,
    House,
    Income,
    InfoGame,
    InfoRules,
    Jail: JailScreen,
    Junkies,
    Kill,
    Login,
    Lotto,
    ManageObject,
    Market,
    MollieComplete,
    MyObjects,
    MyProfile,
    OC,
    Poker,
    Privacy,
    ProtectionShop,
    Racecars,
    RecoverPassword,
    Reports,
    Rob,
    Robbery,
    Shop,
    SignupEmail,
    SignupEmail2,
    Sint,
    Status,
    StealCar,
    SwissBank,
    Theme,
    Streetrace,
    VerifyPhone,
    VerifyPhoneCode,
    WeaponShop,
    Wiet,
    Work,
  };

  const Component = screens[screen];
  return <Component navigation={navigation} screenProps={screenProps} />;
};

const BottomTabs = ({
  view,
  setSelected,
  navigation,
  setView,
  animateToCity,
  dragAndDropMode,
  setDragAndDropMode,
  level,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        flexDirection: "row",
        left: 0,
        right: 0,
        justifyContent: "space-around",
        bottom: 0,
      }}
    >
      {[
        {
          view: "game",
          icon: Icon.MaterialCommunityIcons,
          iconName: "factory",
          isActive: view === "game",
          onPress: () => {
            setSelected(null);
            navigation.popToTop();
            setView("game");
            animateToCity();
          },
        },
        {
          view: "crimes",
          icon: Icon.MaterialCommunityIcons,
          iconName: "pistol",
          isActive: view === "crimes",
          onPress: () => {
            setSelected(null);
            navigation.popToTop();
            setView("crimes");
            animateToCity();
          },
        },
        {
          view: "territories",
          icon: Icon.Ionicons,
          iconName: "md-grid",
          isActive: view === "territories",
          onPress: () => {
            setSelected(null);
            navigation.popToTop();
            setView("territories");
            animateToCity();
          },
        },

        {
          view: "stats",
          icon: Icon.Entypo,
          iconName: "bar-graph",
          isActive: view === "stats",
          onPress: () => {
            if (view === "stats") {
              navigation.popToTop();
              setView("game");
            } else {
              setSelected(null);
              setView("stats");
              navigation.resetTo("Members");
            }
          },
        },

        {
          view: "chat",
          icon: Icon.Ionicons,
          iconName: "ios-chatbubbles",
          isActive: view === "chat",
          onPress: () => {
            if (view === "chat") {
              setView("game");
              navigation.popToTop();
            } else {
              setSelected(null);
              setView("chat");
              navigation.resetTo("Channels");
            }
          },
        },

        {
          view: "more",
          icon: Icon.Entypo,
          iconName: "dots-three-horizontal",
          isActive: view === "more",
          onPress: () => {
            if (view === "more") {
              setView("game");
              navigation.popToTop();
            } else {
              setSelected(null);
              setView("more");
              navigation.resetTo("Settings");
            }
          },
        },

        level >= 5 && {
          icon: Icon.Feather,
          iconName: "move",
          isActive: dragAndDropMode,
          onPress: () => {
            setSelected(null);
            setView("game");
            setDragAndDropMode(!dragAndDropMode);
          },
        },
      ]
        .filter((x) => !!x)
        .map((v, index) => (
          <MapIcon key={`icon${index}`} view={v} />
        ))}
    </View>
  );
};

const ActionsBar = ({
  selected,
  city,
  me,
  device,
  navigation,
  setLoading,
  reloadMe,
  reloadCities,
  selectedArea,
  getAreas,
  view,
}) => {
  const getText = getTextFunction(me?.locale);
  const alertAlert = React.useContext(AlertContext);

  const bombAction = (type) => ({
    inactive: !city?.[`${type}Owner`] || city?.[`${type}Owner`] === me?.name,
    text: getText("bombard"),
    onPress: () => {
      const airplanes = [
        "",
        "Fokker",
        "Fleet",
        "Havilland",
        "Cessna",
        "Douglas",
        "Lear Jet",
        "Raket",
      ];

      alertAlert(
        getText("fillInBombs"),
        me?.airplane === 0
          ? getText("bombNoAirplane")
          : getText(
              "bombAirplaneText",
              airplanes[me?.airplane],
              me?.airplane * 5
            ),
        [
          {
            text: getText("ok"),
            onPress: (bombs) => {
              withCaptcha(
                device.loginToken,
                me?.needCaptcha,
                getText,
                alertAlert,
                async (captcha) => {
                  setLoading(true);
                  const { response } = await post("bomb", {
                    loginToken: device.loginToken,
                    bombs,
                    type,
                    captcha,
                  });
                  setLoading(false);
                  reloadMe(device.loginToken);
                  alertAlert(response, null, null, { key: "bombResponse" });
                  reloadCities();
                }
              );
            },
          },
          {
            text: getText("cancel"),
          },
        ],
        { key: "bomb", textInput: true, keyboardType: "numeric" }
      );
    },
    icon: Icon.FontAwesome,
    iconName: "bomb",
  });
  const takeOverAction = (type) => ({
    inactive: !!city?.[`${type}Owner`],
    text: getText("takeOver"),
    onPress: async () => {
      const { response } = await post("becomeOwner", {
        city: me?.city,
        type,
        token: device.loginToken,
      });
      reloadCities();
      reloadMe(device.loginToken);
      alertAlert(response, null, null, { key: "becomeOwnerResponse" });
    },
    icon: Icon.MaterialCommunityIcons,
    iconName: "account-arrow-left",
  });
  const manageAction = (type) => ({
    inactive: city?.[`${type}Owner`] !== me?.name,
    text: getText("manage"),
    onPress: () =>
      navigation.navigate("ManageObject", { type, city: me?.city }),
    icon: Icon.Ionicons,
    iconName: "md-settings",
  });

  const postGetIncome = async (type, captcha) => {
    setLoading(true);
    const { response } = await post("income", {
      token: device.loginToken,
      captcha,
      type,
    });

    setLoading(false);

    reloadMe(device.loginToken);
    reloadCities();
    alertAlert(response, null, null, { key: "incomeResponse" });
  };
  const incomeAction = (type) => ({
    text: getText("getIncome"),
    onPress: () =>
      withCaptcha(
        device.loginToken,
        me?.needCaptcha,
        getText,
        alertAlert,
        (code) => postGetIncome(type, code)
      ),
    icon: Icon.FontAwesome5,
    iconName: "money-bill-wave",
  });

  const allActions = {
    casino: () => [
      {
        text: getText("poker"),
        onPress: () => navigation.navigate("Poker"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "poker-chip",
        badgeAmount: 0,
      },
      {
        text: getText("lotto"),
        onPress: () => navigation.navigate("Lotto"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "cash-100",
        badgeAmount: 0,
      },
      bombAction("casino"),
      takeOverAction("casino"),
      manageAction("casino"),
    ],
    bulletFactory: () => [
      {
        text: getText("buyBullets"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "factory",
        onPress: () => {
          //navigation.navigate("Bulletfactory")
          alertAlert(
            getText("buyBullets"),
            getText("bulletsText", city?.bulletFactoryPrice, city?.bullets),
            [
              {
                text: getText("ok"),
                onPress: (amount) => {
                  withCaptcha(
                    device.loginToken,
                    me?.needCaptcha,
                    getText,
                    alertAlert,
                    async (captcha) => {
                      setLoading(true);
                      const { response } = await post("buyBullets", {
                        loginToken: device.loginToken,
                        amount,
                        captcha,
                      });
                      setLoading(false);
                      reloadMe(device.loginToken);
                      reloadCities();
                      alertAlert(response, null, null, {
                        key: "buyBulletsResponse",
                      });
                    }
                  );
                },
              },
              {
                text: getText("cancel"),
              },
            ],
            { key: "buyBullets", textInput: true, keyboardType: "numeric" }
          );
        },
        badgeAmount: city?.bullets,
      },
      {
        text: getText("menuGangBulletfactory"),
        icon: Icon.FontAwesome,
        iconName: "group",
        onPress: () => navigation.navigate("GangBulletFactory"),
        badgeAmount: 0,
        inactive: !me?.gangId,
      },
      bombAction("bulletFactory"),
      takeOverAction("bulletFactory"),
      manageAction("bulletFactory"),
    ],
    airport: () => [
      {
        text: getText("menuAirport"),
        icon: Icon.Ionicons,
        iconName: "ios-airplane",
        onPress: () => navigation.navigate("Airport"),
        badgeAmount: 0,
      },
      {
        text: getText("menuAirplaneShop"),
        icon: Icon.Ionicons,
        iconName: "ios-airplane",
        onPress: () => navigation.navigate("AirplaneShop"),
        badgeAmount: 0,
      },
      bombAction("airport"),
      takeOverAction("airport"),
      manageAction("airport"),
    ],

    bank: () => [
      {
        text: getText("menuBank"),
        icon: Icon.FontAwesome,
        iconName: "bank",
        onPress: () => navigation.navigate("Bank"),
        badgeAmount: 0,
      },
      {
        text: getText("menuSwissBank"),
        icon: Icon.FontAwesome5,
        iconName: "money-bill",
        onPress: () => navigation.navigate("SwissBank"),
        badgeAmount: 0,
      },

      {
        text: getText("menuDonate"),
        icon: Icon.FontAwesome5,
        iconName: "donate",
        onPress: () => navigation.navigate("Donate"),
        badgeAmount: 0,
      },

      bombAction("bank"),
      takeOverAction("bank"),
      manageAction("bank"),
    ],

    hospital: () => [
      {
        text: getText("menuHospital"),
        icon: Icon.Entypo,
        iconName: "heart",
        onPress: () => navigation.navigate("Hospital"),
        badgeAmount: 0,
      },
      bombAction("hospital"),
      takeOverAction("hospital"),
      manageAction("hospital"),
    ],
    house: () => [
      {
        text: getText("menuStatus"),
        icon: Icon.Ionicons,
        iconName: "ios-stats",
        onPress: () => navigation.navigate("Status"),
        badgeAmount: 0,
      },
      {
        text: getText("menuBunker"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "castle",
        onPress: () => navigation.navigate("Bunker"),
        badgeAmount: 0,
      },

      {
        text: getText("menuSint"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "shoe-formal",
        onPress: () => navigation.navigate("Sint"),
        badgeAmount: 0,
        inactive:
          me?.level < 2 &&
          !(
            moment().year() > 2020 &&
            ((moment().month() === 10 && moment().date() > 15) ||
              (moment().month() === 11 && moment().date() < 6))
          ),
      },
    ],

    landlord: () => [
      incomeAction("landlord"),
      bombAction("landlord"),
      takeOverAction("landlord"),
      manageAction("landlord"),
    ],
    junkies: () => [
      incomeAction("junkies"),
      bombAction("junkies"),
      takeOverAction("junkies"),
      manageAction("junkies"),
    ],
    rld: () => [
      incomeAction("rld"),
      bombAction("rld"),
      takeOverAction("rld"),
      manageAction("rld"),
    ],

    headquarter: () => [
      {
        text: getText("menuCreateGang"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.navigate("GangCreate"),
        badgeAmount: 0,
        inactive: !!me?.gangId,
      },
      {
        text: getText("menuGangSettings"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.navigate("GangSettings"),
        badgeAmount: 0,
        inactive: !me?.gangId,
      },

      {
        text: getText("menuGangShop"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.navigate("GangShop"),
        badgeAmount: 0,
        inactive: !me?.gangId,
      },

      {
        text: getText("menuGangAchievements"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.navigate("GangAchievements"),
        badgeAmount: 0,
        inactive: !me?.gangId,
      },
      {
        text: getText("menuGangMissions"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.navigate("GangMissions"),
        badgeAmount: 0,
        inactive: !me?.gangId,
      },
    ],
    gym: () => [
      {
        text: getText("menuGym"),
        icon: Icon.Ionicons,
        iconName: "md-fitness",
        onPress: () => navigation.navigate("Gym"),
        badgeAmount: 0,
      },
      bombAction("gym"),
      takeOverAction("gym"),
      manageAction("gym"),
    ],
    garage: () => [
      {
        text: getText("menuGarage"),
        icon: Icon.FontAwesome,
        iconName: "car",
        onPress: () => navigation.navigate("Garage"),
        badgeAmount: 0,
      },

      {
        text: getText("menuRacecars"),
        icon: Icon.FontAwesome5,
        iconName: "car",
        onPress: () => navigation.navigate("Racecars"),
        badgeAmount: 0,
      },

      {
        text: getText("menuGarageShop"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "garage",
        onPress: () => navigation.navigate("GarageShop"),
        badgeAmount: 0,
      },

      bombAction("garage"),
      takeOverAction("garage"),
      manageAction("garage"),
    ],

    jail: () => [
      {
        text: getText("menuJail2"),
        icon: Icon.FontAwesome,
        iconName: "bars",
        onPress: () => navigation.navigate("Jail"),
        badgeAmount: 0,
      },
      bombAction("jail"),
      takeOverAction("jail"),
      manageAction("jail"),
    ],

    market: () => [
      {
        text: getText("menuMarket"),
        icon: Icon.FontAwesome,
        iconName: "handshake-o",
        onPress: () => navigation.navigate("Market"),
        badgeAmount: 0,
      },
      bombAction("market"),
      takeOverAction("market"),
      manageAction("market"),
    ],
    weaponShop: () => [
      {
        text: getText("buyWeapons"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "pistol",
        onPress: () => navigation.navigate("WeaponShop"),
        badgeAmount: 0,
      },

      {
        text: getText("buyProtection"),
        icon: Icon.FontAwesome,
        iconName: "shield",
        onPress: () => navigation.navigate("ProtectionShop"),
        badgeAmount: 0,
      },
      bombAction("weaponShop"),
      takeOverAction("weaponShop"),
      manageAction("weaponShop"),
    ],

    estateAgent: () => [
      {
        text: getText("menuEstateAgent"),
        icon: Icon.FontAwesome,
        iconName: "home",
        onPress: () => navigation.navigate("EstateAgent"),
        badgeAmount: 0,
      },
      bombAction("estateAgent"),
      takeOverAction("estateAgent"),
      manageAction("estateAgent"),
    ],

    stockExchange: () => [
      {
        text: getText("menuStockExchange"),
        icon: Icon.Entypo,
        iconName: "area-graph",
        onPress: () => navigation.navigate("StockExchange"),
        badgeAmount: 0,
      },
      bombAction("stockExchange"),
      takeOverAction("stockExchange"),
      manageAction("stockExchange"),
    ],
    area: () => {
      return [
        {
          inactive: !!selectedArea?.userId,
          text: getText("takeOver"),
          onPress: async () => {
            setLoading(true);
            const { response } = await post("takeEmptyArea", {
              loginToken: device.loginToken,
              id: selectedArea?.id,
            });

            setLoading(false);

            getAreas();
            reloadMe(device.loginToken);
            alertAlert(response, null, null, {
              key: "takeEmptyAreaResponse",
            });
          },
          icon: Icon.MaterialCommunityIcons,
          iconName: "account-arrow-left",
        },

        {
          inactive:
            selectedArea?.userId === me?.id || selectedArea?.userId === null,
          text: getText("menuBomb"),
          onPress: async () => {
            const airplanes = [
              "",
              "Fokker",
              "Fleet",
              "Havilland",
              "Cessna",
              "Douglas",
              "Lear Jet",
              "Raket",
            ];

            alertAlert(
              getText("fillInBombs"),
              me?.airplane === 0
                ? getText("bombNoAirplane")
                : getText(
                    "bombAirplaneText",
                    airplanes[me?.airplane],
                    me?.airplane * 5
                  ),
              [
                {
                  text: getText("ok"),
                  onPress: (bombs) => {
                    withCaptcha(
                      device.loginToken,
                      me?.needCaptcha,
                      getText,
                      alertAlert,
                      async (captcha) => {
                        setLoading(true);
                        const { response } = await post("bombArea", {
                          loginToken: device.loginToken,
                          bombs,
                          id: connectedArea?.id,
                          captcha,
                        });
                        setLoading(false);
                        reloadMe(device.loginToken);
                        alertAlert(response, null, null, {
                          key: "bombAreaResponse",
                        });
                        reloadCities();
                      }
                    );
                  },
                },
                {
                  text: getText("cancel"),
                },
              ],
              { key: "bombArea", textInput: true, keyboardType: "numeric" }
            );
          },
          icon: Icon.FontAwesome,
          iconName: "bomb",
        },

        {
          inactive:
            selectedArea?.userId !== me?.id || selectedArea?.damage === 0,
          text: getText("repair"),
          onPress: async () => {
            setLoading(true);
            const { response } = await post("repairMyArea", {
              token: device.loginToken,
              id: selectedArea?.id,
            });
            setLoading(false);
            getAreas();
            reloadMe(device.loginToken);
            alertAlert(response, null, null, { key: "repairMyAreaResponse" });
          },
          icon: Icon.AntDesign,
          iconName: "tool",
        },
      ];
    },
  };

  const statsActions = [
    {
      text: getText("menuMembers", me?.online),
      icon: Icon.FontAwesome,
      iconName: "group",
      onPress: () => navigation.resetTo("Members"),
      badgeAmount: 0,
    },

    {
      text: getText("menuStats"),
      icon: Icon.Entypo,
      iconName: "area-graph",
      onPress: () => navigation.resetTo("Stats"),
      badgeAmount: 0,
    },

    {
      text: getText("menuGangs"),
      icon: Icon.MaterialCommunityIcons,
      iconName: "home-group",
      onPress: () => navigation.resetTo("Gangs"),
      badgeAmount: 0,
    },

    {
      text: getText("prizes"),
      icon: Icon.FontAwesome5,
      iconName: "award",
      onPress: () => navigation.resetTo("Prizes"),
      badgeAmount: 0,
    },

    {
      text: getText("menuProperties"),
      icon: Icon.FontAwesome5,
      iconName: "house-damage",
      onPress: () => navigation.resetTo("Properties"),
      badgeAmount: 0,
    },
  ];

  const moreActions = [
    {
      text: getText("menuSettings"),
      icon: Icon.Ionicons,
      iconName: "ios-settings",
      onPress: () => navigation.resetTo("Settings"),
    },

    {
      text: getText("menuInfo"),
      icon: Icon.Entypo,
      iconName: "info",
      onPress: () => navigation.resetTo("Info"),
    },

    {
      text: getText("menuPolice"),
      icon: Icon.Foundation,
      iconName: "sheriff-badge",
      onPress: () => navigation.resetTo("Police"),
    },
    {
      text: getText("menuVIP"),
      icon: Icon.MaterialIcons,
      iconName: "person-add",
      onPress: () => navigation.resetTo("VIP"),
    },
  ];
  const actions =
    view === "territories" || view === "game"
      ? selected
        ? allActions[selected]().filter((x) => !x.inactive)
        : []
      : view === "stats"
      ? statsActions
      : view === "more"
      ? moreActions
      : [];

  return (
    actions.length > 0 && (
      <ScrollView
        horizontal
        style={{
          position: "absolute",
          left: 0,
          bottom: 60,
          height: 70,
          flexDirection: "row",
        }}
      >
        {actions.map((action, index) => (
          <View key={`action${index}`}>
            <TouchableOpacity
              onPress={() => {
                requestAnimationFrame(() => {
                  console.log("onPress action");
                  action.onPress();
                });
              }}
              style={{
                width: 70,
                marginHorizontal: 10,
                height: 70,
                borderRadius: 10,
                backgroundColor: device.theme.secondary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <action.icon
                name={action.iconName}
                size={40}
                color={device.theme.secondaryText}
              />
              <Text
                style={{
                  color: device.theme.secondaryText,
                  fontWeight: "bold",
                  fontSize: 10,
                }}
                numberOfLines={1}
              >
                {action.text}
              </Text>
            </TouchableOpacity>
            {action.badgeAmount > 0 ? (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  backgroundColor: "red",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {action.badgeAmount}
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    )
  );
};
const Overlay = React.memo(
  ({
    screenProps,
    navigation,
    map,
    view,
    setView,
    setZoom,
    device,
    me,
    selected,
    setSelected,
    objects,
    dragAndDropMode,
    setDragAndDropMode,
    territoriesSwiperRefContainer,
    propertiesSwiperRefContainer,
    cityAreas,
    areas,
    reloadCities,
    reloadMe,
    city,
    getAreas,
    selectedAreaIndex,
    setSelectedAreaIndex,
  }) => {
    const { showActionSheetWithOptions } = useActionSheet();
    const getText = getTextFunction(me?.locale);
    const [loading, setLoading] = useState(false);

    const selectedArea =
      selectedAreaIndex !== undefined
        ? areas?.find(
            (x) => x.code === cityAreas.areas[selectedAreaIndex]?.code
          )
        : null;
    // console.log("render overlay");

    const openActionSheet = () => {
      // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html

      const options = [
        getText("killSomeone"),
        getText("robSomeone"),
        getText("organizeStreetrace"),
        getText("organizeRobbery"),
      ];

      if (me?.gangId) {
        options.push(getText("organizeOC"));
      }

      options.push(getText("cancel"));
      const destructiveButtonIndex = undefined;
      const cancelButtonIndex = options.length - 1;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            navigation.navigate("Kill");
          } else if (buttonIndex === 1) {
            navigation.navigate("Rob");
          } else if (buttonIndex === 2) {
            navigation.navigate("CreateStreetrace");
          } else if (buttonIndex === 3) {
            navigation.navigate("CreateRobbery");
          } else if (buttonIndex === 4 && me?.gangId) {
            navigation.navigate("CreateOc");
          }
          // Do something here depending on the button index selected
        }
      );
    };

    const animateToCity = () => {
      if (Platform.OS === "web") {
        map.panTo({
          lat: city.latitude,
          lng: city.longitude,
        });
        console.log("animateTocity");
        setZoom(getZoom(city?.delta));
      } else {
        map.animateToRegion({
          latitude: city.latitude,
          longitude: city.longitude,
          latitudeDelta: city.delta * 1.2,
          longitudeDelta: city.delta * 1.2,
        });
      }
    };

    const renderTerritoriesSwiper = (
      <View style={{ height: 150 }}>
        <Swiper
          controlsEnabled={false}
          key={`Swiper1`}
          ref={territoriesSwiperRefContainer}
          style={{ flex: 1 }}
          initialPage={0}
          onIndexChanged={(position) => {
            if (position === 0) {
              //should animate to whole city
              animateToCity();
              setSelected(null);
              setSelectedAreaIndex(null);
            } else {
              setSelected("area");
              setSelectedAreaIndex(position - 1);

              const area = cityAreas.areas[position - 1];
              // const region = cityAreas.areas[position].area[0]; //first point for now, later pick center
              if (Platform.OS === "web") {
                map.panTo({
                  lat: area.centerLatitude,
                  lng: area.centerLongitude,
                });
                const biggestDelta =
                  area.latitudeDelta > area.longitudeDelta
                    ? area.latitudeDelta
                    : area.longitudeDelta;

                setZoom(getZoom(biggestDelta));
              } else {
                map.animateToRegion({
                  latitude: area.centerLatitude,
                  longitude: area.centerLongitude,
                  latitudeDelta: area.latitudeDelta,
                  longitudeDelta: area.longitudeDelta,
                });
              }
            }
            //improve this once i have centers.
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              {me?.city}: {cityAreas.areas.length} {getText("territories")}
            </Text>
          </View>
          {cityAreas.areas.map((area, index) => {
            const connectedArea = areas?.find((x) => x.code === area.code);

            return (
              <View key={`page${index}`} style={{ height: 150, flex: 1 }}>
                <Grid>
                  <Col>
                    <Text style={{ color: "white" }}>{getText("area")}</Text>
                  </Col>
                  <Col size={2}>
                    <Text style={{ color: "white" }}>{area.name}</Text>
                  </Col>
                </Grid>
                <Grid>
                  <Col>
                    <Text style={{ color: "white" }}>{getText("owner")}</Text>
                  </Col>
                  <Col size={2}>
                    {connectedArea?.user && (
                      <User
                        size={40}
                        user={connectedArea.user}
                        navigation={navigation}
                      />
                    )}
                  </Col>
                </Grid>

                <Grid>
                  <Col>
                    <Text style={{ color: "white" }}>{getText("damage")}</Text>
                  </Col>
                  <Col size={2}>
                    <Text style={{ color: "white" }}>
                      {connectedArea?.damage}% {getText("damage")}
                    </Text>
                  </Col>
                </Grid>

                <Text style={{ color: "white" }}></Text>
              </View>
            );
          })}
        </Swiper>
      </View>
    );

    const renderPropertiesSwiper = (
      <View style={{ height: 100 }}>
        <Swiper
          controlsEnabled={false}
          key={`Swiper2`}
          ref={propertiesSwiperRefContainer}
          style={{ flex: 1 }}
          initialPage={0}
          onIndexChanged={(position) => {
            if (position === 0) {
              //should animate to whole city
              animateToCity();
              setSelected(null);
            } else {
              const object = objects[position - 1];
              const latitude = city[`${object.type}Latitude`];
              const longitude = city[`${object.type}Longitude`];

              // const region = cityAreas.areas[position].area[0]; //first point for now, later pick center
              // if (latitude && longitude) {
              //   map.animateToRegion({
              //     latitude,
              //     longitude,
              //     latitudeDelta: (city?.delta / 100) * object.size,
              //     longitudeDelta: (city?.delta / 100) * object.size,
              //   });
              // }

              setSelected(object.type);
            }
            //improve this once i have centers.
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              {me?.city}
            </Text>
          </View>
          {objects.map((object, index) => {
            const owner = city?.[`${object.type}Owner`];
            const damage = city?.[`${object.type}Damage`];
            const profit = city?.[`${object.type}Profit`];

            const ownerProfile = owner ? (
              <TouchableOpacity
                onPress={() => navigation.navigate("Profile", { name: owner })}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {owner}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ fontWeight: "bold", color: "white" }}>
                ({getText("none")})
              </Text>
            );

            return (
              <View key={`page${index}`} style={{ flex: 1 }}>
                {owner !== undefined && (
                  <Grid>
                    <Col>
                      <Text style={{ color: "white" }}>
                        {getText(object.type)} {getText("owner")}
                      </Text>
                    </Col>
                    <Col>{ownerProfile}</Col>
                  </Grid>
                )}

                {profit !== undefined && (
                  <Grid>
                    <Col>
                      <Text style={{ color: "white" }}>
                        {getText(object.type)} {getText("profit")}
                      </Text>
                    </Col>
                    <Col>
                      <Text style={{ color: "white" }}>
                        €{numberFormat(profit)},-
                      </Text>
                    </Col>
                  </Grid>
                )}
                {damage !== undefined && (
                  <Grid>
                    <Col>
                      <Text style={{ color: "white" }}>
                        {getText(object.type)} {getText("damage")}
                      </Text>
                    </Col>
                    <Col>
                      <Text style={{ color: "white" }}>{damage}%</Text>
                    </Col>
                  </Grid>
                )}
              </View>
            );
          })}
        </Swiper>
      </View>
    );

    const currentObject = objects.find((x) => x.type === selected);
    const title =
      selected === "area"
        ? selectedArea?.name
        : currentObject
        ? getText(currentObject?.title)
        : "";

    return (
      <>
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.5)",
            top: 0,
            left: 0,
            right: 0,
            padding: 5,
          }}
        >
          <SafeAreaView
            style={{
              marginTop:
                Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
          >
            {view === "territories" ? (
              renderTerritoriesSwiper
            ) : view === "game" ? (
              renderPropertiesSwiper
            ) : (
              <Stats device={device} me={me} />
            )}
          </SafeAreaView>
        </View>

        <View style={{ position: "absolute", left: 10, bottom: 135 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>{title}</Text>
        </View>

        {view === "crimes" && (
          <View
            style={{
              position: "absolute",
              top: 110,
              left: 5,
            }}
          >
            <MapIcon
              view={{
                icon: Icon.AntDesign,
                iconName: "plus",
                isActive: false,
                onPress: openActionSheet,
              }}
            />
          </View>
        )}

        {loading && (
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <ActivityIndicator color="black" size="large" />
          </View>
        )}
        {me?.reizenAt > Date.now() && (
          <View
            style={{
              position: "absolute",
              top: 130,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 20,
              flexDirection: "row",
              padding: 10,
            }}
          >
            <Icon.Ionicons name="ios-airplane" color="white" size={24} />

            <CountDown
              until={Math.round((me?.reizenAt - Date.now()) / 1000)}
              onFinish={() => {
                // reloadMe(device.loginToken);
              }}
              size={10}
              timeToShow={["M", "S"]}
              timeLabels={{ m: null, s: null }}
            />
          </View>
        )}

        {me?.jailAt > Date.now() && (
          <View
            style={{
              position: "absolute",
              top: 180,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 20,
              flexDirection: "row",
              padding: 10,
            }}
          >
            <Icon.FontAwesome name="bars" color="white" size={24} />

            <CountDown
              until={Math.round((me?.jailAt - Date.now()) / 1000)}
              onFinish={() => {
                // reloadMe(device.loginToken);
              }}
              size={10}
              timeToShow={["M", "S"]}
              timeLabels={{ m: null, s: null }}
            />
          </View>
        )}

        <ActionsBar
          selected={selected}
          view={view}
          city={city}
          me={me}
          device={device}
          navigation={navigation}
          setLoading={setLoading}
          reloadMe={reloadMe}
          reloadCities={reloadCities}
          selectedArea={selectedArea}
          getAreas={getAreas}
        />

        {navigation.state.routeName && (
          <Modal view={view} navigation={navigation} setView={setView}>
            <Screen navigation={navigation} screenProps={screenProps} />
          </Modal>
        )}

        <BottomTabs
          view={view}
          setSelected={setSelected}
          navigation={navigation}
          setView={setView}
          animateToCity={animateToCity}
          dragAndDropMode={dragAndDropMode}
          setDragAndDropMode={setDragAndDropMode}
          level={me?.level}
        />
      </>
    );
  }
);

export default Overlay;
