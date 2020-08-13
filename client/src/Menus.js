import React from "react";
import CountDown from "react-native-countdown-component";
import { getRank } from "./Util";
export const leftMenu = (me, theme) => {
  const stealcarSeconds = Math.ceil(
    (me?.autostelenAt + 60000 - Date.now()) / 1000
  );

  const crimeSeconds = Math.ceil((me?.crimeAt + 60000 - Date.now()) / 1000);

  const attackSeconds = Math.ceil((me?.attackAt + 120000 - Date.now()) / 1000);

  const robSeconds = Math.ceil((me?.robAt + 30000 - Date.now()) / 1000);
  const ocSeconds = Math.ceil((me?.ocAt + 120000 - Date.now()) / 1000);

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
      iconType: "FontAwesome",
      icon: "font",
    },

    {
      iconType: "FontAwesome",
      icon: "car",
      text: "Auto Stelen",
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

      text: "Misdaden",
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
      text: "Aanvallen",
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
      text: "Beroven",
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

      text: "Georganiseerde Misdaad",
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

      text: "Sportschool",
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

      text: "Wietplantage",
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

      text: "Junkies",
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

      text: "Hoeren",
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
      iconType: "FontAwesome",
      icon: "bars",

      text: `Gevangenis (${me?.jail})`,
      to: "Jail",
    },

    {
      iconType: "FontAwesome",
      icon: "font",
      isHeader: true,
      text: "Uitgeven",
    },

    {
      iconType: "MaterialCommunityIcons",
      icon: "cash-100",
      text: "Bank",
      to: "Bank",
    },
    {
      iconType: "MaterialCommunityIcons",
      icon: "pistol",
      text: "Kogelfabriek",
      to: "Bulletfactory",
    },

    {
      iconType: "MaterialCommunityIcons",
      icon: "warehouse",

      text: "Schuilkelder",
      to: "Bunker",
    },

    {
      iconType: "FontAwesome5",
      icon: "house-damage",

      text: "Ziekenhuis",
      to: "Hospital",
    },

    {
      iconType: "FontAwesome5",
      icon: "warehouse",
      text: "Winkel",
      to: "Shop",
    },

    {
      iconType: "Ionicons",
      icon: "ios-car",
      text: "Garage",
      to: "Garage",
    },
    {
      iconType: "MaterialIcons",
      icon: "local-car-wash",
      text: "Racecars",
      to: "Racecars",
    },
    {
      iconType: "MaterialCommunityIcons",
      icon: "car-key",
      text: "Streetrace",
      to: "Streetrace",
    },
    // {
    //   text: "Kogelfabriek",
    // iconType: "FontAwesome",
    // icon: "font",
    //   to: "Bulletfactory"
    // },
    // {
    //   text: "Casino",
    //   to: "Casino"
    // },
    {
      iconType: "FontAwesome",
      icon: "plane",

      text: "Vliegveld",
      to: "Airport",
    },
  ];
};

const adminMenu = (me) => {
  const gameMod =
    me?.level > 1
      ? [
          {
            iconType: "FontAwesome",
            icon: "font",

            isHeader: true,
            text: "Admin panel",
          },
        ]
      : [];

  const admin =
    me?.level >= 10
      ? [
          {
            iconType: "FontAwesome",
            icon: "font",

            text: "Emailen",
            to: "AdminEmail",
          },
        ]
      : [];

  return [...gameMod, ...admin];
};

export const rightMenu = (me, theme) => [
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

    text: "Contant: " + me?.cash,
  },

  {
    isStats: true,

    iconType: "FontAwesome",
    icon: "font",

    text: "Bank: " + me?.bank,
  },
  {
    isStats: true,

    iconType: "FontAwesome",
    icon: "font",

    text: "Kogels: " + me?.bullets,
  },
  {
    isStats: true,

    iconType: "FontAwesome",
    icon: "font",

    text: "Rank: " + getRank(me?.rank, "both"),
  },
  {
    isStats: true,

    iconType: "FontAwesome",
    icon: "font",

    text: "Health: " + me?.health + "%",
  },
  {
    isStats: true,

    iconType: "FontAwesome",
    icon: "font",

    text: "Stad: " + me?.city,
  },

  {
    iconType: "FontAwesome",
    icon: "font",

    isHeader: true,
    text: "Maatschappij",
  },
  {
    iconType: "Entypo",
    icon: "info-with-circle",

    text: "Status",
    to: "Status",
  },

  {
    iconType: "Ionicons",
    icon: "ios-people",

    text: `Leden (${me?.online} online)`,
    to: "Members",
  },

  {
    iconType: "AntDesign",
    icon: "star",

    text: "Statistieken",
    to: "Stats",
  },

  {
    iconType: "FontAwesome5",
    icon: "money-bill-wave",

    text: "Doneren",
    to: "Donate",
  },

  {
    iconType: "MaterialIcons",
    icon: "attach-money",

    text: "Inkomen",
    to: "Income",
  },

  // {
  //   text: "Statistieken",
  //   to: "Stats"
  // },

  {
    iconType: "Entypo",
    icon: "info-with-circle",

    isHeader: true,
    text: "Algemeen",
  },

  {
    iconType: "Ionicons",
    icon: "ios-chatbubbles",
    text: "Chat",
    to: "Chat",
  },

  {
    iconType: "MaterialCommunityIcons",
    icon: "chat",

    text: `Berichten (${me?.messages})`,
    to: "Messages",
  },

  {
    iconType: "FontAwesome",
    icon: "wechat",

    text: "Forum",
    to: "Forum",
  },

  {
    iconType: "SimpleLineIcons",
    icon: "settings",

    text: "Instellingen",
    to: "Settings",
  },

  {
    iconType: "Entypo",
    icon: "info-with-circle",

    text: "Informatie",
    to: "Info",
  },

  {
    iconType: "FontAwesome",
    icon: "bank",

    text: "Credits kopen",
    to: "Mollie",
  },

  {
    iconType: "FontAwesome5",
    icon: "piggy-bank",

    text: "Creditshop",
    to: "Creditshop",
  },

  {
    iconType: "AntDesign",
    icon: "message1",

    text: "Super bericht",
    to: "SuperMessage",
  },

  ...adminMenu(me),
];
