import React from "react";
import CountDown from "react-native-countdown-component";
import { getRank, getTextFunction, numberFormat } from "./Util";
export const leftMenu = (me, theme) => {
  const stealcarSeconds = Math.ceil(
    (me?.autostelenAt + 60000 - Date.now()) / 1000
  );

  const crimeSeconds = Math.ceil((me?.crimeAt + 60000 - Date.now()) / 1000);
  const bunkerSeconds = Math.ceil((me?.bunkerAt - Date.now()) / 1000);

  const attackSeconds = Math.ceil((me?.attackAt + 120000 - Date.now()) / 1000);

  const robSeconds = Math.ceil((me?.robAt + 30000 - Date.now()) / 1000);
  const ocSeconds = Math.ceil((me?.ocAt + 120000 - Date.now()) / 1000);

  const gymSeconds = Math.ceil((me?.gymAt + me?.gymTime - Date.now()) / 1000);
  const wietSeconds = Math.ceil((me?.wietAt + 120000 - Date.now()) / 1000);
  const junkiesSeconds = Math.ceil(
    (me?.junkiesAt + 120000 - Date.now()) / 1000
  );
  const hoerenSeconds = Math.ceil((me?.hoerenAt + 120000 - Date.now()) / 1000);
  const workSeconds = Math.ceil((me?.workAt - Date.now()) / 1000);

  const getText = getTextFunction(me?.locale);

  return [
    {
      isHeader: true,
      text: getText("headerCrime"),
      iconType: "FontAwesome",
      icon: "font",
    },

    {
      iconType: "FontAwesome",
      icon: "car",
      text: getText("menuStealCar"),
      to: "StealCar",
      component:
        stealcarSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={stealcarSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      iconType: "Ionicons",
      icon: "md-cash",
      text: getText("menuCrimes"),
      to: "Crimes",
      component:
        crimeSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={crimeSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },
    {
      iconType: "MaterialCommunityIcons",
      icon: "pistol",
      text: getText("menuKill"),
      to: "Kill",
      component:
        attackSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={attackSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },
    {
      iconType: "MaterialCommunityIcons",
      icon: "pistol",
      text: getText("menuRob"),
      to: "Rob",
      component:
        robSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={robSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },
    {
      iconType: "Ionicons",
      icon: "md-cash",
      text: getText("menuOC"),
      to: "OrganisedCrime",
      component:
        ocSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={ocSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },
    {
      iconType: "AntDesign",
      icon: "stepforward",

      text: getText("menuGym"),
      to: "Gym",
      component:
        gymSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={gymSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      iconType: "MaterialCommunityIcons",
      icon: "tree",

      text: getText("menuWiet"),
      to: "Wiet",
      component:
        wietSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={wietSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      iconType: "MaterialIcons",
      icon: "people",

      text: getText("menuJunkies"),
      to: "Junkies",
      component:
        junkiesSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={junkiesSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      iconType: "FontAwesome",
      icon: "female",

      text: getText("menuProstitutes"),
      to: "Hoeren",
      component:
        hoerenSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={hoerenSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      iconType: "AntDesign",
      icon: "tool",

      text: getText("menuWork"),
      to: "Work",
      component:
        workSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={workSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      iconType: "FontAwesome",
      icon: "bars",

      text: getText("menuJail", me?.jail),
      to: "Jail",
    },

    {
      iconType: "FontAwesome",
      icon: "font",
      isHeader: true,
      text: getText("headerSpend"),
    },

    {
      iconType: "FontAwesome",
      icon: "bank",
      text: getText("menuBank"),
      to: "AllBanks",
    },
    {
      iconType: "MaterialCommunityIcons",
      icon: "pistol",
      text: getText("menuBulletfactory"),
      to: "Bulletfactory",
    },

    {
      iconType: "FontAwesome",
      icon: "bomb",
      text: getText("menuBomb"),
      to: "Bomb",
    },

    {
      iconType: "FontAwesome5",
      icon: "dice",
      text: getText("menuCasino"),
      to: "Casino",
    },

    {
      iconType: "MaterialCommunityIcons",
      icon: "warehouse",
      text: getText("menuBunker"),
      to: "Bunker",
      component:
        bunkerSeconds > 0 ? (
          <CountDown
            style={{ marginLeft: 10 }}
            until={bunkerSeconds}
            digitStyle={{ backgroundColor: theme.secondary }}
            digitTxtStyle={{ color: theme.secondaryText }}
            onFinish={() => {}}
            size={8}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
          />
        ) : null,
    },

    {
      iconType: "FontAwesome5",
      icon: "hospital",
      text: getText("menuHospital"),
      to: "Hospital",
    },

    {
      iconType: "Entypo",
      icon: "shop",
      text: getText("menuShop"),
      to: "Shop",
    },

    {
      iconType: "Ionicons",
      icon: "ios-car",
      text: getText("menuGarage"),
      to: "Garage",
    },
    {
      iconType: "MaterialIcons",
      icon: "local-car-wash",
      text: getText("menuRacecars"),
      to: "Racecars",
    },
    {
      iconType: "MaterialCommunityIcons",
      icon: "car-key",
      text: getText("menuStreetrace"),
      to: "Streetrace",
    },

    {
      iconType: "FontAwesome",
      icon: "plane",
      text: getText("menuAirport"),
      to: "Airport",
    },
  ];
};

const adminMenu = (me) => {
  const getText = getTextFunction(me?.locale);

  const gameMod =
    me?.level > 1
      ? [
          {
            iconType: "FontAwesome",
            icon: "font",
            isHeader: true,
            text: getText("headerAdminPanel"),
          },

          {
            iconType: "Entypo",
            icon: "eye",
            text: getText("menuUserWatch"),
            to: "AdminUserWatch",
          },

          {
            iconType: "Entypo",
            icon: "eye",
            text: getText("menuHackers"),
            to: "Hackers",
          },

          {
            iconType: "Entypo",
            icon: "eye",
            text: getText("menuPolice"),
            to: "Police",
          },
        ]
      : [];

  const admin =
    me?.level >= 10
      ? [
          {
            iconType: "FontAwesome",
            icon: "font",
            text: getText("menuAdminEmail"),
            to: "AdminEmail",
          },
        ]
      : [];

  return [...gameMod, ...admin];
};

export const rightMenu = (me, theme) => {
  const getText = getTextFunction(me?.locale);

  return [
    {
      iconType: "FontAwesome",
      icon: "font",

      isHeader: true,
      text: me?.name,
      to: "Profile",
      params: { name: me?.name },
    },

    {
      isStats: true,
      iconType: "FontAwesome",
      icon: "font",

      text: getText("menuCash", numberFormat(me?.cash)),
    },

    {
      isStats: true,

      iconType: "FontAwesome",
      icon: "font",

      text: getText("menuBankMoney", numberFormat(me?.bank)),
    },
    {
      isStats: true,

      iconType: "FontAwesome",
      icon: "font",

      text: getText("menuBullets", numberFormat(me?.bullets)),
    },
    {
      isStats: true,

      iconType: "FontAwesome",
      icon: "font",
      text: getText("menuRank", getRank(me?.rank, "both")),
    },
    {
      isStats: true,

      iconType: "FontAwesome",
      icon: "font",

      text: getText("menuHealth", me?.health),
    },
    {
      isStats: true,

      iconType: "FontAwesome",
      icon: "font",

      text: getText("menuCity", me?.city),
    },

    {
      iconType: "FontAwesome",
      icon: "font",

      isHeader: true,
      text: getText("headerSociety"),
    },

    {
      iconType: "Ionicons",
      icon: "ios-people",

      text: getText("menuMembers", me?.online),
      to: "Members",
    },

    {
      iconType: "AntDesign",
      icon: "star",
      text: getText("menuStats"),
      to: "Stats",
    },

    {
      iconType: "AntDesign",
      icon: "star",
      text: getText("menuMyObjects"),
      to: "MyObjects",
    },

    {
      iconType: "AntDesign",
      icon: "star",
      text: getText("menuStatus"),
      to: "Status",
    },

    {
      iconType: "Entypo",
      icon: "info-with-circle",

      isHeader: true,
      text: getText("headerGeneral"),
    },

    {
      iconType: "Ionicons",
      icon: "ios-chatbubbles",
      text: getText("menuChat"),
      to: "Chat",
    },

    {
      iconType: "Ionicons",
      icon: "ios-chatbubbles",
      text: getText("menuChannels", me?.chats),
      to: "Channels",
    },

    {
      iconType: "FontAwesome",
      icon: "wechat",

      text: getText("menuForum"),
      to: "Forum",
    },

    {
      iconType: "SimpleLineIcons",
      icon: "settings",

      text: getText("menuSettings"),
      to: "Settings",
    },

    {
      iconType: "Entypo",
      icon: "info-with-circle",

      text: getText("menuInfo"),
      to: "Info",
    },

    {
      iconType: "FontAwesome",
      icon: "bank",
      text: getText("menuVIP"),
      to: "VIP",
    },

    ...adminMenu(me),
  ];
};
