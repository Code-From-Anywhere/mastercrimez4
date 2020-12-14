import * as Icon from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { AlertContext } from "../components/AlertProvider";
import Countdown from "../components/Countdown";
import {
  getTextFunction,
  InactiveScreens,
  lighterHex,
  post,
  withCaptcha,
} from "../Util";
import { animateToCity, animateToWorld } from "./MapUtil";

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
  reloadAreas,
  view,
  map,
  shouldRenderCities,
}) => {
  const getText = getTextFunction(me?.locale);
  const alertAlert = React.useContext(AlertContext);

  const dispatch = useDispatch();
  const bombAction = (type) => ({
    inactive: !city?.[`${type}Owner`] || city?.[`${type}Owner`] === me?.name,
    text: getText("bombard"),
    onPress: () => {
      if (me?.bombAt + 300000 > Date.now()) {
        alertAlert(
          getText("bombWait"),
          getText("bombWaitText"),
          [
            {
              text: getText("ok"),
              onPress: () => {
                const text = getText(
                  "bombAskOnWhatsAppText",
                  getText(type),
                  me?.city,
                  city?.[`${type}Damage`]
                );
                const siteUrl = "https://mastercrimez.com";
                Linking.openURL(
                  Platform.OS === "web"
                    ? `https://wa.me/?text=${text} ${siteUrl}`
                    : `whatsapp://send?text=${text} ${siteUrl}`
                );
              },
            },
            { text: getText("cancel") },
          ],
          { key: "bombWait" }
        );
      } else {
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
      }
    },
    icon: Icon.FontAwesome,
    iconName: "bomb",
    component: me?.bombAt + 300000 > Date.now() && (
      <Countdown
        until={me?.bombAt + 300000}
        timeToShow={["mm", "ss"]}
        size={10}
      />
    ),
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
    onPress: () => navigation.resetTo("ManageObject", { type, city: me?.city }),
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
        onPress: () => navigation.resetTo("Poker"),
        isSelected: navigation.state.routeName === "Poker",
        icon: Icon.MaterialCommunityIcons,
        iconName: "poker-chip",
        badgeAmount: 0,
      },
      {
        inactive:
          me?.level < 2 &&
          InactiveScreens.LOTTO_RELEASE_DATE.isBefore(moment()),
        text: getText("lotto"),
        onPress: () => navigation.resetTo("Lotto"),
        isSelected: navigation.state.routeName === "Lotto",
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
        onPress: () => navigation.resetTo("GangBulletFactory"),
        isSelected: navigation.state.routeName === "GangBulletFactory",
        badgeAmount: 0,

        inactive:
          !me?.gangId ||
          (me?.level < 2 &&
            moment().isBefore(
              InactiveScreens.GANG_BULLET_FACTORY_RELEASE_DATE
            )),
        isNew: moment().isBefore(
          moment(InactiveScreens.GANG_BULLET_FACTORY_RELEASE_DATE).add(
            InactiveScreens.DAYS_NEW,
            "days"
          )
        ),
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
        onPress: () => {
          animateToWorld({ map, dispatch, city });
        },
        badgeAmount: 0,
      },
      {
        text: getText("menuAirplaneShop"),
        icon: Icon.Ionicons,
        iconName: "ios-airplane",
        isSelected: navigation.state.routeName === "AirplaneShop",
        onPress: () => navigation.resetTo("AirplaneShop"),
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
        isSelected: navigation.state.routeName === "Bank",
        onPress: () => navigation.resetTo("Bank"),
        badgeAmount: 0,
      },
      {
        text: getText("menuSwissBank"),
        icon: Icon.FontAwesome5,
        iconName: "money-bill",
        onPress: () => navigation.resetTo("SwissBank"),
        isSelected: navigation.state.routeName === "SwissBank",
        badgeAmount: 0,
      },

      {
        text: getText("menuDonate"),
        icon: Icon.FontAwesome5,
        iconName: "donate",
        onPress: () => navigation.resetTo("Donate"),
        isSelected: navigation.state.routeName === "Donate",
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
        onPress: () => navigation.resetTo("Hospital"),
        isSelected: navigation.state.routeName === "Hospital",

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
        onPress: () => navigation.resetTo("Status"),
        isSelected: navigation.state.routeName === "Status",
        badgeAmount: 0,
      },
      {
        text: getText("menuBunker"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "castle",
        onPress: () => navigation.resetTo("Bunker"),
        isSelected: navigation.state.routeName === "Bunker",
        badgeAmount: 0,
      },

      {
        text: getText("menuSint"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "shoe-formal",
        onPress: () => navigation.resetTo("Sint"),
        isSelected: navigation.state.routeName === "Sint",
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
        text: getText("menuGangCreate"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.resetTo("GangCreate"),
        isSelected: navigation.state.routeName === "GangCreate",

        badgeAmount: 0,
        inactive: !!me?.gangId,
      },
      {
        text: getText("menuGangSettings"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.resetTo("GangSettings"),
        isSelected: navigation.state.routeName === "GangSettings",

        badgeAmount: 0,
        inactive: !me?.gangId,
      },

      {
        text: getText("menuGangShop"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.resetTo("GangShop"),
        isSelected: navigation.state.routeName === "GangShop",

        badgeAmount: 0,
        inactive: !me?.gangId,
      },

      {
        text: getText("menuGangAchievements"),
        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.resetTo("GangAchievements"),
        isSelected: navigation.state.routeName === "GangAchievements",

        badgeAmount: 0,
        inactive: !me?.gangId,
      },
      {
        inactive:
          !me?.gangId ||
          (me?.level < 2 &&
            moment().isBefore(InactiveScreens.GANG_MISSIONS_RELEASE_DATE)),
        isNew: moment().isBefore(
          moment(InactiveScreens.GANG_MISSIONS_RELEASE_DATE).add(
            InactiveScreens.DAYS_NEW,
            "days"
          )
        ),
        text: getText("menuGangMissions"),
        isSelected: navigation.state.routeName === "GangMissions",

        icon: Icon.Ionicons,
        iconName: "ios-people",
        onPress: () => navigation.resetTo("GangMissions"),
        badgeAmount: 0,
      },
    ],
    gym: () => [
      {
        text: getText("menuGym"),
        icon: Icon.Ionicons,
        iconName: "md-fitness",
        onPress: () => navigation.resetTo("Gym"),
        isSelected: navigation.state.routeName === "Gym",

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
        onPress: () => navigation.resetTo("Garage"),
        isSelected: navigation.state.routeName === "Garage",

        badgeAmount: 0,
      },

      {
        text: getText("menuRacecars"),
        icon: Icon.FontAwesome5,
        iconName: "car",
        onPress: () => navigation.resetTo("Racecars"),
        isSelected: navigation.state.routeName === "Racecars",

        badgeAmount: 0,
      },

      {
        text: getText("menuGarageShop"),
        icon: Icon.MaterialCommunityIcons,
        iconName: "garage",
        onPress: () => navigation.resetTo("GarageShop"),
        isSelected: navigation.state.routeName === "GarageShop",

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
        onPress: () => navigation.resetTo("Jail"),
        isSelected: navigation.state.routeName === "Jail",

        badgeAmount: me?.jail,
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
        onPress: () => navigation.resetTo("Market"),
        isSelected: navigation.state.routeName === "Market",
        inactive:
          me?.level < 2 &&
          InactiveScreens.MARKET_RELEASE_DATE.isBefore(moment()),

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
        onPress: () => navigation.resetTo("WeaponShop"),
        isSelected: navigation.state.routeName === "WeaponShop",

        badgeAmount: 0,
      },

      {
        text: getText("buyProtection"),
        icon: Icon.FontAwesome,
        iconName: "shield",
        onPress: () => navigation.resetTo("ProtectionShop"),
        isSelected: navigation.state.routeName === "ProtectionShop",

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
        onPress: () => navigation.resetTo("EstateAgent"),
        isSelected: navigation.state.routeName === "EstateAgent",

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
        onPress: () => navigation.resetTo("StockExchange"),
        isSelected: navigation.state.routeName === "StockExchange",
        inactive:
          me?.level < 2 &&
          InactiveScreens.STOCK_MARKET_RELEASE_DATE.isBefore(moment()),

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
            alertAlert(response, null, null, {
              key: "takeEmptyAreaResponse",
            });

            reloadAreas(me?.city);
            reloadMe(device.loginToken);
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
                          areaId: selectedArea?.id,
                          captcha,
                        });
                        setLoading(false);
                        reloadMe(device.loginToken);
                        alertAlert(response, null, null, {
                          key: "bombAreaResponse",
                        });
                        reloadAreas(me?.city);
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
              loginToken: device.loginToken,
              id: selectedArea?.id,
            });
            setLoading(false);
            reloadAreas(me?.city);
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
      isSelected: navigation.state.routeName === "Members",

      badgeAmount: 0,
    },

    {
      text: getText("menuStats"),
      icon: Icon.Entypo,
      iconName: "area-graph",
      onPress: () => navigation.resetTo("Stats"),
      isSelected: navigation.state.routeName === "Stats",

      badgeAmount: 0,
    },

    {
      text: getText("menuGangs"),
      icon: Icon.MaterialCommunityIcons,
      iconName: "home-group",
      onPress: () => navigation.resetTo("Gangs"),
      isSelected: navigation.state.routeName === "Gangs",

      badgeAmount: 0,
    },

    {
      text: getText("prizes"),
      icon: Icon.FontAwesome5,
      iconName: "award",
      onPress: () => navigation.resetTo("Prizes"),
      isSelected: navigation.state.routeName === "Prizes",

      badgeAmount: 0,
    },

    {
      text: getText("menuProperties"),
      icon: Icon.FontAwesome5,
      iconName: "house-damage",
      onPress: () => navigation.resetTo("Properties"),
      isSelected: navigation.state.routeName === "Properties",

      badgeAmount: 0,
    },
  ];

  const moreActions = [
    {
      text: getText("menuSettings"),
      icon: Icon.Ionicons,
      iconName: "ios-settings",
      onPress: () => navigation.resetTo("Settings"),
      isSelected: navigation.state.routeName === "Settings",
    },

    {
      text: getText("menuInfo"),
      icon: Icon.Entypo,
      iconName: "info",
      onPress: () => navigation.resetTo("Info"),
      isSelected: navigation.state.routeName === "Info",
    },

    {
      text: getText("menuPolice"),
      icon: Icon.Foundation,
      iconName: "sheriff-badge",
      onPress: () => navigation.resetTo("Police"),
      isSelected: navigation.state.routeName === "Police",
    },
    {
      text: getText("menuVIP"),
      icon: Icon.MaterialIcons,
      iconName: "person-add",
      onPress: () => navigation.resetTo("VIP"),
      isSelected: navigation.state.routeName === "VIP",
    },

    {
      text: getText("menuForum"),
      icon: Icon.MaterialIcons,
      iconName: "forum",
      onPress: () => navigation.resetTo("Forum"),
      isSelected: navigation.state.routeName === "Forum",
    },
  ];

  const citiesActions = me?.canChooseCity
    ? []
    : [
        {
          text: getText("goBack"),
          icon: Icon.AntDesign,
          iconName: "back",
          onPress: () => animateToCity({ city, dispatch, map }),
          isSelected: false,
        },
      ];

  const actions = shouldRenderCities
    ? citiesActions
    : view === "territories" || view === "game"
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
          zIndex: 1,
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
                backgroundColor: action.isSelected
                  ? lighterHex(device.theme.primary)
                  : device.theme.secondary,
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

            {action.component ? (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  backgroundColor: "#404040",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                }}
              >
                {action.component}
              </View>
            ) : action.badgeAmount > 0 ? (
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
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 10 }}
                >
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

export default ActionsBar;
