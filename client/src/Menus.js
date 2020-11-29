import moment from "moment";
import React from "react";
import CountDown from "react-native-countdown-component";
import Constants from "./Constants";
import { getRank, getTextFunction, numberFormat } from "./Util";

export const isHappyHour = () => {
  const isSunday = moment().day() === 0; //sunday
  const is7pm = moment().hour() === 19; //19pm
  const isHappyHourReleased = moment().isAfter(
    moment("01/02/2021", "DD/MM/YYYY").set("hour", 17)
  );
  return isHappyHourReleased && (isSunday || is7pm);
};

export const InactiveScreens = {
  ACTIONS_BEFORE_BOMB: 60,
  ACTIONS_BEFORE_CASINO: 70,
  ACTIONS_BEFORE_BUNKER: 20,
  ACTIONS_BEFORE_HOSPITAL: 30,
  ACTIONS_BEFORE_RACECARS: 80,
  ACTIONS_BEFORE_STREETRACE: 80,
  ACTIONS_AMOUNT_NEW: 10,
  ACTIONS_BEFORE_ROB: 20,
  ACTIONS_BEFORE_KILL: 30,
  ACTIONS_BEFORE_BULLETFACTORY: 40,
  ACTIONS_BEFORE_MARKET: 50,
  ACTIONS_BEFORE_AIRPORT: 30,
  DAYS_NEW: 14,
  ACTIONS_BEFORE_POLICE: 100,
  PRIZES_NORMAL_RELEASE_DATE: moment("01/12/2020", "DD/MM/YYYY").set(
    "hours",
    17
  ),
  GANG_RELEASE_DATE: moment("01/12/2020", "DD/MM/YYYY").set("hours", 17),
  MARKET_RELEASE_DATE: moment("15/12/2020", "DD/MM/YYYY").set("hours", 17),
  PRIZES_RELEASE_DATE: moment("01/01/2021", "DD/MM/YYYY").set("hours", 17),
  POLICE_RELEASE_DATE: moment("15/01/2021", "DD/MM/YYYY").set("hours", 17),
  //happy hour 1 feb

  WORK_RELEASE_DATE: moment("15/04/2021", "DD/MM/YYYY").set("hours", 17),
};

export const leftMenu = (me, theme) => {
  const stealcarSeconds = Math.ceil(
    (me?.autostelenAt + 60000 - Date.now()) / 1000
  );

  const crimeSeconds = Math.ceil((me?.crimeAt + 60000 - Date.now()) / 1000);
  const bunkerSeconds = Math.ceil((me?.bunkerAt - Date.now()) / 1000);

  const attackSeconds = Math.ceil((me?.attackAt + 120000 - Date.now()) / 1000);

  const robSeconds = Math.ceil((me?.robAt + 30000 - Date.now()) / 1000);

  const gymSeconds = Math.ceil((me?.gymAt + me?.gymTime - Date.now()) / 1000);
  const wietSeconds = Math.ceil((me?.wietAt + 120000 - Date.now()) / 1000);
  const junkiesSeconds = Math.ceil(
    (me?.junkiesAt + 120000 - Date.now()) / 1000
  );
  const hoerenSeconds = Math.ceil((me?.hoerenAt + 120000 - Date.now()) / 1000);

  const getText = getTextFunction(me?.locale);

  return [
    {
      header: {
        isHeader: true,
        text: getText("headerCrime"),
        label: isHappyHour() ? "Happy Hour" : undefined,
      },

      content: [
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
          inactive: !me || me?.numActions < InactiveScreens.ACTIONS_BEFORE_KILL,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_KILL +
              InactiveScreens.ACTIONS_AMOUNT_NEW,
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
          inactive: !me || me?.numActions < InactiveScreens.ACTIONS_BEFORE_ROB,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_ROB +
              InactiveScreens.ACTIONS_AMOUNT_NEW,
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
          inactive:
            moment().isBefore(InactiveScreens.WORK_RELEASE_DATE) &&
            me?.level < 2,
          isNew: moment().isBefore(
            InactiveScreens.WORK_RELEASE_DATE.add(
              InactiveScreens.DAYS_NEW,
              "days"
            )
          ),
          iconType: "AntDesign",
          icon: "tool",
          text: getText("menuWork"),
          to: "Work",
        },

        {
          iconType: "FontAwesome",
          icon: "bars",
          text: getText("menuJail", me?.jail),
          to: "Jail",
        },

        {
          inactive:
            me?.level < 2 &&
            !(
              moment().year() > 2020 &&
              ((moment().month() === 10 && moment().date() > 15) ||
                (moment().month() === 11 && moment().date() < 6))
            ),
          isNew: true,
          iconType: "AntDesign",
          icon: "star",
          text: getText("menuSint"),
          to: "Sint",
        },
      ].filter((x) => !!x && !x.inactive),
    },

    {
      header: {
        isHeader: true,
        text: getText("headerSpend"),
      },

      content: [
        {
          iconType: "FontAwesome",
          icon: "bank",
          text: getText("menuBank"),
          to: "AllBanks",
        },

        {
          inactive:
            ((!me || me.level < 1) &&
              moment().isBefore(InactiveScreens.MARKET_RELEASE_DATE)) ||
            me?.numActions < InactiveScreens.ACTIONS_BEFORE_MARKET,
          isNew:
            moment().isBefore(
              InactiveScreens.MARKET_RELEASE_DATE.add(
                InactiveScreens.DAYS_NEW,
                "days"
              )
            ) ||
            me?.numActions <
              InactiveScreens.ACTIONS_BEFORE_MARKET +
                InactiveScreens.ACTIONS_AMOUNT_NEW,
          iconType: "FontAwesome",
          icon: "bank",
          text: getText("menuMarket"),
          to: "Market",
        },

        {
          inactive:
            me?.numActions < InactiveScreens.ACTIONS_BEFORE_BULLETFACTORY,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_BULLETFACTORY +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "MaterialCommunityIcons",
          icon: "pistol",
          text: getText("menuBulletfactory"),
          to: "Bulletfactory",
        },

        {
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_BOMB,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_BOMB +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "FontAwesome",
          icon: "bomb",
          text: getText("menuBomb"),
          to: "Bomb",
        },

        {
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_CASINO,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_CASINO +
              InactiveScreens.ACTIONS_AMOUNT_NEW,
          iconType: "FontAwesome5",
          icon: "dice",
          text: getText("menuCasino"),
          to: "Casino",
        },

        {
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_BUNKER,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_BUNKER +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

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
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_HOSPITAL,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_HOSPITAL +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

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
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_RACECARS,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_RACECARS +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "MaterialIcons",
          icon: "local-car-wash",
          text: getText("menuRacecars"),
          to: "Racecars",
        },
        {
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_STREETRACE,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_STREETRACE +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "MaterialCommunityIcons",
          icon: "car-key",
          text: getText("menuStreetrace"),
          to: "Streetrace",
        },

        {
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_AIRPORT,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_AIRPORT +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "FontAwesome",
          icon: "plane",
          text: getText("menuAirport"),
          to: "Airport",
        },
      ].filter((x) => !!x && !x.inactive),
    },
  ];
};

const adminMenu = (me) => {
  const getText = getTextFunction(me?.locale);

  const gameMod =
    me?.level >= 5
      ? [
          {
            iconType: "Entypo",
            icon: "eye",
            text: getText("menuUserWatch"),
            to: "AdminUserWatch",
          },
        ]
      : [];

  const admin = me?.level >= 10 ? [] : [];

  return (
    me?.level > 1 && {
      header: {
        isHeader: true,
        text: getText("headerAdminPanel"),
      },
      content: [...gameMod, ...admin],
    }
  );
};

export const rightMenu = (me, theme) => {
  const getText = getTextFunction(me?.locale);
  const ocSeconds = Math.ceil((me?.ocAt + 120000 - Date.now()) / 1000);

  const gangMenus =
    me?.level > 1 || moment().isAfter(InactiveScreens.GANG_RELEASE_DATE)
      ? {
          header: {
            isHeader: true,
            isNew: moment().isBefore(
              InactiveScreens.GANG_RELEASE_DATE.add(
                InactiveScreens.DAYS_NEW,
                "days"
              )
            ),
            text: me?.gang?.name || getText("headerGang"),
            image: me?.gang?.thumbnail
              ? Constants.SERVER_ADDR + me?.gang?.thumbnail
              : null,
          },
          content: [
            !me?.gangId && {
              iconType: "Ionicons",
              icon: "ios-people",
              text: getText("menuGangCreate"),
              to: "GangCreate",
            },
            {
              iconType: "Ionicons",
              icon: "ios-people",
              text: getText("menuGangs"),
              to: "Gangs",
            },

            me?.gangId && {
              iconType: "Ionicons",
              icon: "ios-people",
              text: getText("menuGangSettings"),
              to: "GangSettings",
            },

            me?.gangId && {
              iconType: "Ionicons",
              icon: "ios-people",
              text: getText("menuGangShop"),
              to: "GangShop",
            },

            me?.gangId && {
              iconType: "Ionicons",
              icon: "ios-people",
              text: getText("menuGangAchievements"),
              to: "GangAchievements",
            },

            me?.gangId && {
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
            // me?.gangId && {
            //   iconType: "Ionicons",
            //   icon: "ios-people",
            //   text: getText("menuGangOc"),
            //   to: "GangOc",
            // },
          ].filter((x) => !!x),
        }
      : null;

  return [
    {
      header: {
        isHeader: true,
        text: me?.name,
        image: me?.thumbnail ? Constants.SERVER_ADDR + me?.thumbnail : null,
      },

      content: [
        {
          isStats: true,
          iconType: "FontAwesome5",
          icon: "coins",
          text: getText("menuCash", numberFormat(me?.cash)),
          to: "AllBanks",
        },

        {
          isStats: true,

          iconType: "FontAwesome",
          icon: "money",

          text: getText("menuBankMoney", numberFormat(me?.bank)),
          to: "AllBanks",
        },
        {
          isStats: true,

          iconType: "MaterialCommunityIcons",
          icon: "bullet",

          text: getText("menuBullets", numberFormat(me?.bullets)),
          to: "Kill",
        },
        {
          isStats: true,

          iconType: "SimpleLineIcons",
          icon: "badge",
          text: getText("menuRank", getRank(me?.rank, "both")),
          to: "Status",
        },
        {
          isStats: true,

          iconType: "AntDesign",
          icon: "heart",

          text: getText("menuHealth", me?.health),
          to: "Hospital",
        },
        {
          isStats: true,

          iconType: "Ionicons",
          icon: "ios-airplane",

          text: getText("menuCity", me?.city),
          to: "Airport",
        },

        {
          iconType: "Ionicons",
          icon: "ios-chatbubbles",
          text: getText("menuChannels", me?.chats),
          to: "Channels",
        },
      ],
    },

    {
      header: {
        isHeader: true,
        text: getText("headerSociety"),
      },
      content: [
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
      ],
    },

    gangMenus,

    {
      header: {
        isHeader: true,
        text: getText("headerGeneral"),
      },
      content: [
        {
          iconType: "Ionicons",
          icon: "ios-chatbubbles",
          text: getText("menuChat"),
          to: "Chat",
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
          inactive:
            ((!me || me?.level < 1) &&
              moment().isBefore(InactiveScreens.POLICE_RELEASE_DATE)) ||
            me?.numActions < InactiveScreens.ACTIONS_BEFORE_POLICE,
          isNew:
            moment().isBefore(
              InactiveScreens.POLICE_RELEASE_DATE.add(
                InactiveScreens.DAYS_NEW,
                "days"
              )
            ) ||
            me?.numActions <
              InactiveScreens.ACTIONS_BEFORE_POLICE +
                InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "Entypo",
          icon: "eye",
          text: getText("menuHackers"),
          to: "Hackers",
        },

        {
          inactive:
            ((!me || me?.level < 1) &&
              moment().isBefore(InactiveScreens.POLICE_RELEASE_DATE)) ||
            me?.numActions < InactiveScreens.ACTIONS_BEFORE_POLICE,
          isNew:
            moment().isBefore(
              InactiveScreens.POLICE_RELEASE_DATE.add(
                InactiveScreens.DAYS_NEW,
                "days"
              )
            ) ||
            me?.numActions <
              InactiveScreens.ACTIONS_BEFORE_POLICE +
                InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "Entypo",
          icon: "eye",
          text: getText("menuPolice"),
          to: "Police",
        },

        {
          iconType: "FontAwesome",
          icon: "bank",
          text: getText("menuVIP"),
          to: "VIP",
        },

        {
          inactive:
            me?.level < 2 &&
            moment().isBefore(InactiveScreens.PRIZES_NORMAL_RELEASE_DATE),
          isNew: moment().isBefore(
            InactiveScreens.PRIZES_RELEASE_DATE.add(
              InactiveScreens.DAYS_NEW,
              "days"
            )
          ),
          iconType: "AntDesign",
          icon: "star",
          text: getText("prizes"),
          to: "Prizes",
        },
      ].filter((x) => !!x && !x.inactive),
    },

    adminMenu(me),
  ].filter((x) => !!x);
};
