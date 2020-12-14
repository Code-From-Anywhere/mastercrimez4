import * as Icon from "@expo/vector-icons";
import moment from "moment";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import CountDown from "../components/Countdown";
import Hoverable from "../components/Hoverable";
import T from "../components/T";
import Constants from "../Constants";
import { getTextFunction, InactiveScreens, lighterHex, post } from "../Util";
import { getZoom, selectBuilding } from "./MapUtil";

export const isHappyHour = () => {
  const isSunday = moment().day() === 0; //sunday
  const is7pm = moment().hour() === 19; //19pm
  const isHappyHourReleased = moment().isAfter(
    InactiveScreens.HAPPY_HOUR_RELEASE_DATE
  );
  return isHappyHourReleased && (isSunday || is7pm);
};

export const leftMenu = (me, theme) => {
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
  const robberySeconds = Math.ceil(
    (me?.robberyAt + me?.robberySeconds * 1000 - Date.now()) / 1000
  );

  const ocSeconds = Math.ceil((me?.ocAt + 3600000 - Date.now()) / 1000);

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
          view: "crimes",
          iconType: "FontAwesome",
          icon: "car",
          text: getText("menuStealCar"),
          to: "StealCar",
          component:
            stealcarSeconds > 0 ? (
              <CountDown
                style={{ marginLeft: 10 }}
                until={me?.autostelenAt + 60000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },

        {
          iconType: "Ionicons",
          icon: "md-cash",
          text: getText("menuCrimes"),
          to: "Crimes",
          view: "crimes",
          component:
            crimeSeconds > 0 ? (
              <CountDown
                style={{ marginLeft: 10 }}
                until={me?.crimeAt + 60000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },

        {
          view: "crimes",
          iconType: "MaterialCommunityIcons",
          icon: "tree",
          text: getText("menuWiet"),
          to: "Wiet",
          component:
            wietSeconds > 0 ? (
              <CountDown
                style={{ marginLeft: 10 }}
                until={me?.wietAt + 120000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },

        {
          view: "crimes",
          iconType: "MaterialIcons",
          icon: "people",
          text: getText("menuJunkies"),
          to: "Junkies",
          component:
            junkiesSeconds > 0 ? (
              <CountDown
                style={{ marginLeft: 10 }}
                until={me?.junkiesAt + 120000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },

        {
          view: "crimes",
          iconType: "FontAwesome",
          icon: "female",
          text: getText("menuProstitutes"),
          to: "Hoeren",
          component:
            hoerenSeconds > 0 ? (
              <CountDown
                style={{ marginLeft: 10 }}
                until={me?.hoerenAt + 120000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },

        {
          view: "crimes",
          inactive:
            moment().isBefore(InactiveScreens.WORK_RELEASE_DATE) &&
            me?.level < 2,
          isNew: moment().isBefore(
            moment(InactiveScreens.WORK_RELEASE_DATE).add(
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
          view: "crimes",
          inactive:
            !me?.id || me?.numActions < InactiveScreens.ACTIONS_BEFORE_KILL,
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
                until={me?.attackAt + 120000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },
        {
          view: "crimes",
          inactive:
            !me?.id || me?.numActions < InactiveScreens.ACTIONS_BEFORE_ROB,
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
                until={me?.robAt + 30000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },

        {
          view: "crimes",
          inactive:
            (moment().isBefore(InactiveScreens.ROBBERY_RELEASE_DATE) &&
              me?.level < 2) ||
            me?.numActions < InactiveScreens.ACTIONS_BEFORE_ROBBERY,
          isNew:
            moment().isBefore(
              moment(InactiveScreens.ROBBERY_RELEASE_DATE).add(
                InactiveScreens.DAYS_NEW,
                "days"
              )
            ) ||
            me?.numActions <
              InactiveScreens.ACTIONS_BEFORE_ROBBERY +
                InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "Ionicons",
          icon: "md-cash",
          text: getText("menuRobbery"),
          to: "Robbery",
          component:
            robberySeconds > 0 ? (
              <CountDown
                style={{ marginLeft: 10 }}
                until={me?.robberyAt + me?.robberySeconds * 1000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },

        {
          view: "crimes",
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_STREETRACE,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_STREETRACE +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "FontAwesome5",
          icon: "car-crash",
          text: getText("menuStreetrace"),
          to: "Streetrace",
        },

        me?.gangId && {
          view: "crimes",
          inactive:
            me?.level < 2 && moment().isBefore(InactiveScreens.OC_RELEASE_DATE),
          isNew: moment().isBefore(
            moment(InactiveScreens.OC_RELEASE_DATE).add(
              InactiveScreens.DAYS_NEW,
              "days"
            )
          ),
          iconType: "Ionicons",
          icon: "md-cash",
          text: getText("menuOC"),
          to: "OC",
          component:
            ocSeconds > 0 ? (
              <CountDown
                style={{ marginLeft: 10 }}
                until={me?.ocAt + 3600000}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
              />
            ) : null,
        },
      ].filter((x) => !!x && !x.inactive),
    },

    {
      header: {
        isHeader: true,
        text: getText("headerBuildings"),
      },

      content: [
        {
          iconType: "FontAwesome5",
          icon: "home",
          text: getText("menuHome"),
          buildingType: "house",
          to: "Status",
        },

        {
          iconType: "MaterialCommunityIcons",
          icon: "home-analytics",
          text: getText("menuHeadquarter"),
          buildingType: "headquarter",
          to: "GangSettings",
        },

        {
          iconType: "FontAwesome5",
          icon: "beer",
          text: getText("menuSalvationArmy"),
          buildingType: "junkies",
        },

        {
          iconType: "AntDesign",
          icon: "heart",
          text: getText("menuSexShop"),
          buildingType: "rld",
        },

        {
          iconType: "Entypo",
          icon: "shop",
          text: getText("menuCoffeeShop"),
          buildingType: "landlord",
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
          buildingType: "bulletFactory",
        },

        {
          view: "game",
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_AIRPORT,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_AIRPORT +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "FontAwesome",
          icon: "plane",
          text: getText("menuAirport"),
          buildingType: "airport",
        },

        {
          view: "game",
          iconType: "FontAwesome",
          icon: "bank",
          text: getText("menuBank"),
          buildingType: "bank",
          to: "Bank",
        },

        {
          view: "game",
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_CASINO,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_CASINO +
              InactiveScreens.ACTIONS_AMOUNT_NEW,
          iconType: "FontAwesome5",
          icon: "dice",
          text: getText("menuCasino"),
          buildingType: "casino",
          to: "Poker",
        },

        {
          iconType: "Ionicons",
          icon: "ios-car",
          text: getText("menuGarage"),
          buildingType: "garage",
          to: "Garage",
        },

        {
          to: "Gym",
          iconType: "AntDesign",
          icon: "stepforward",
          text: getText("menuGym"),
          buildingType: "gym",
          component:
            gymSeconds > 0 ? (
              <CountDown
                style={{ marginLeft: 10 }}
                until={me?.gymAt + me?.gymTime}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                size={8}
                timeToShow={["mm", "ss"]}
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
          buildingType: "hospital",
          to: "Hospital",
        },

        {
          iconType: "FontAwesome",
          icon: "bars",
          text: getText("menuJail2"),
          buildingType: "jail",
          badgeCount: me?.jail,
          to: "Jail",
        },

        {
          view: "game",
          inactive:
            ((!me?.id || me.level < 1) &&
              moment().isBefore(InactiveScreens.MARKET_RELEASE_DATE)) ||
            me?.numActions < InactiveScreens.ACTIONS_BEFORE_MARKET,
          isNew:
            moment().isBefore(
              moment(InactiveScreens.MARKET_RELEASE_DATE).add(
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
          buildingType: "market",
          to: "Market",
        },

        {
          view: "game",
          iconType: "Entypo",
          icon: "home",
          text: getText("homeShop"),
          buildingType: "estateAgent",
          to: "EstateAgent",
        },

        {
          view: "game",
          iconType: "MaterialCommunityIcons",
          icon: "pistol",
          text: getText("menuWeaponShop"),
          buildingType: "weaponShop",
          to: "WeaponShop",
        },

        {
          view: "game",
          iconType: "Entypo",
          icon: "line-graph",
          inactive:
            me?.level < 2 &&
            InactiveScreens.STOCK_MARKET_RELEASE_DATE.isBefore(moment()),
          text: getText("menuStockExchange"),
          buildingType: "stockExchange",
          to: "StockExchange",
        },
      ].filter((x) => !!x && !x.inactive),
    },
  ].filter((x) => !!x);
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

          {
            iconType: "Entypo",
            icon: "eye",
            text: getText("menuReports"),
            to: "Reports",
          },
        ]
      : [];

  const betaTester = me?.level >= 2 ? [] : [];
  const admin = me?.level >= 10 ? [] : [];

  return (
    me?.level > 1 && {
      header: {
        isHeader: true,
        text: getText("headerAdminPanel"),
      },
      content: [...betaTester, ...gameMod, ...admin],
    }
  );
};

export const rightMenu = (me, theme, areas, channels, device, city) => {
  const getText = getTextFunction(me?.locale);

  const allAreasMenus = areas.map((area, index) => {
    return {
      image: area.user?.thumbnail,
      iconType: "Feather",
      icon: "map-pin",
      text: area.name,
      goToArea: index,
    };
  });

  const last10ChannelsMenus = channels?.slice
    ? channels.slice(0, 10).map((item) => {
        const channelTitle = item.channel?.name
          ? item.channel?.name
          : item.channel?.channelsubs.length === 2
          ? item.channel?.channelsubs.find((x) => x.userId !== me?.id)?.user
              ?.name
          : "(System)";

        const channelThumbnail = item.channel?.image
          ? item.channel?.image
          : item.channel?.channelsubs.length === 2
          ? item.channel?.channelsubs.find((x) => x.userId !== me?.id)?.user
              ?.thumbnail
          : null;

        return {
          image: null,
          text: channelTitle,
          image: channelThumbnail,
          iconType: "Ionicons",
          view: "chat",
          icon: "ios-person",
          badgeCount: item.unread,
          to: "Channel",
          params: { subid: item.id, id: item.channel.id },
          onPress: () => {
            post("setRead", { loginToken: device.loginToken, id: item.id });
          },
        };
      })
    : [];

  return [
    {
      header: {
        isHeader: true,
        text: getText("headerStats"),
      },
      content: [
        {
          iconType: "Ionicons",
          icon: "ios-people",
          text: getText("menuMembers", me?.online),
          to: "Members",
          view: "stats",
        },

        {
          iconType: "AntDesign",
          icon: "star",
          text: getText("menuStats"),
          to: "Stats",

          view: "stats",
        },

        {
          iconType: "Ionicons",
          icon: "ios-people",
          text: getText("menuGangs"),
          to: "Gangs",

          view: "stats",
        },

        {
          text: getText("prizes"),
          iconType: "FontAwesome5",
          icon: "award",
          to: "Prizes",

          view: "stats",
          inactive:
            me?.level < 2 &&
            moment().isBefore(InactiveScreens.PRIZES_NORMAL_RELEASE_DATE),
          isNew: moment().isBefore(
            moment(InactiveScreens.PRIZES_RELEASE_DATE).add(
              InactiveScreens.DAYS_NEW,
              "days"
            )
          ),
        },

        {
          text: getText("menuProperties"),
          iconType: "FontAwesome5",
          icon: "house-damage",
          to: "Properties",

          view: "stats",
        },
      ],
    },

    {
      header: {
        isHeader: true,
        text: getText("headerChat"),
      },
      content: [
        {
          iconType: "Ionicons",
          icon: "ios-chatbubbles",
          text: getText("everyone"),
          to: "Chat",
          view: "chat",
        },

        ...last10ChannelsMenus,

        {
          iconType: "Ionicons",
          icon: "ios-chatbubbles",
          text: getText("allChats"),
          to: "Channels",
          view: "chat",
        },
      ].filter((x) => !!x && !x.inactive),
    },

    moment("01/02/2021", "DD/MM/YYYY")
      .add(city.id, "weeks")
      .isBefore(moment()) && {
      header: {
        isHeader: true,
        text: getText("headerAreas"),
      },
      content: allAreasMenus,
    },

    {
      header: {
        isHeader: true,
        text: getText("headerMore"),
      },
      content: [
        {
          iconType: "SimpleLineIcons",
          icon: "settings",
          view: "more",
          text: getText("menuSettings"),
          to: "Settings",
        },

        {
          iconType: "Entypo",
          icon: "info-with-circle",

          view: "more",
          text: getText("menuInfo"),
          to: "Info",
        },

        {
          view: "more",
          inactive:
            ((!me?.id || me?.level < 1) &&
              moment().isBefore(InactiveScreens.POLICE_RELEASE_DATE)) ||
            me?.numActions < InactiveScreens.ACTIONS_BEFORE_POLICE,
          isNew:
            moment().isBefore(
              moment(InactiveScreens.POLICE_RELEASE_DATE).add(
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
          view: "more",
          iconType: "FontAwesome",
          icon: "bank",
          text: getText("menuVIP"),
          to: "VIP",
        },

        {
          view: "more",
          iconType: "FontAwesome",
          icon: "wechat",
          text: getText("menuForum"),
          to: "Forum",
        },
      ].filter((x) => !!x && !x.inactive),
    },

    adminMenu(me),
  ].filter((x) => !!x);
};

export const renderMenu = ({
  item,
  index,
  navigation,
  theme,
  dispatch,
  me,
  cityAreas,
  setSelectedAreaIndex,
  map,
  setSelected,
  setZoom,
  city,
  setView,
  areas,
  device,
}) => {
  const TheIcon = Icon[item.iconType];

  const isCurrent = navigation.state.routeName === item.to;
  const TouchOrView = item.isHeader ? View : TouchableOpacity;
  const getText = getTextFunction(me?.locale);

  let specialColor = null;
  const gangMembers = me?.gangMembers; //should be an {name,id}[] of users in your gang

  if (item.buildingType !== undefined) {
    const owner = city?.[`${item.buildingType}Owner`];
    const isYours = owner === me?.name;
    const isGang = gangMembers?.map((x) => x.name).includes(owner);
    const hasDamage = city?.[`${item.buildingType}Damage`] > 0;
    const hasProfit = city?.[`${item.buildingType}Profit`] > 0;

    const incomeJunkies =
      item.buildingType === "junkies" &&
      Math.floor((Date.now() - me?.junkiesIncomeAt) / 3600000) > 0;
    const incomeLandlord =
      item.buildingType === "landlord" &&
      Math.floor((Date.now() - me?.landlordIncomeAt) / 3600000) > 0;
    const incomeRLD =
      item.buildingType === "rld" &&
      Math.floor((Date.now() - me?.rldIncomeAt) / 3600000) > 0;

    const incomeToGet = incomeJunkies || incomeRLD || incomeLandlord;
    const jailPrisoners = item.buildingType === "jail" && me?.jail > 0;
    const gymTrain =
      item.buildingType === "gym" && me?.gymAt + me?.gymTime - Date.now() < 0;
    const canDoSomething = jailPrisoners || gymTrain;

    specialColor =
      isYours && hasDamage
        ? "darkred"
        : (isYours && hasProfit) || incomeToGet || canDoSomething
        ? "yellow"
        : isYours
        ? "blue"
        : !owner &&
          item.buildingType !== "house" &&
          item.buildingType !== "headquarter"
        ? "lightblue"
        : hasDamage
        ? "red"
        : isGang
        ? "green"
        : null;
  } else if (item.goToArea !== undefined) {
    const area = cityAreas.areas[item.goToArea];
    const connectedArea = areas?.find((x) => x?.code === area?.code);

    const isYours = connectedArea?.userId === me?.id;
    const isGang =
      connectedArea?.gangId === me?.gangId ||
      connectedArea?.user?.gangId === me?.gangId;
    const hasDamage = connectedArea?.damage > 0;
    const hasProfit = connectedArea?.profit > 0;

    specialColor =
      isYours && hasDamage
        ? "darkred"
        : isYours && hasProfit
        ? "yellow"
        : isYours
        ? "blue"
        : !connectedArea?.userId
        ? "lightblue"
        : hasDamage
        ? "red"
        : isGang
        ? "green"
        : null;
  }
  return (
    <TouchOrView
      key={`item${index}`}
      onPress={(e) => {
        if (item.onPress) {
          item.onPress();
        }
        if (item.to) {
          navigation.resetTo(item.to, item.params);

          const movement = {
            action: "Web_Menu_" + item.to,
            locationX: e.nativeEvent.locationX,
            locationY: e.nativeEvent.locationY,
            timestamp: Date.now(),
          };

          dispatch({ type: "ADD_MOVEMENT", value: movement });
        } else {
          navigation.popToTop();
        }

        if (item.view) {
          setView(item.view);
        }
        if (item.buildingType) {
          selectBuilding({
            type: item.buildingType,
            city,
            cityAreas,
            map,
            setSelected,
            setView,
            setZoom,
            animate: true,
            device,
            dispatch,
            getText,
          });
        }

        if (item.goToArea !== undefined) {
          const area = cityAreas.areas[item.goToArea];
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

          setView("territories");
          setSelected("area");
          setSelectedAreaIndex(item.goToArea);
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
                : `${theme.primary}CC`,
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
                {item.image ? (
                  <Image
                    source={{ uri: Constants.SERVER_ADDR + item.image }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderWidth: specialColor ? 2 : 0,
                      borderColor: specialColor ? specialColor : undefined,
                    }}
                  />
                ) : TheIcon ? (
                  <TheIcon
                    name={item.icon}
                    size={20}
                    color={specialColor ? specialColor : theme.secondaryText}
                  />
                ) : null}
              </View>
              <Text
                numberOfLines={1}
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

              {item.badgeCount > 0 ? (
                <View
                  style={{
                    marginLeft: 10,
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                  >
                    {item.badgeCount}
                  </Text>
                </View>
              ) : null}
              {item.component}
            </View>
          </View>
        )}
      </Hoverable>
    </TouchOrView>
  );
};

const Menus = ({
  children,
  device,
  me,
  navigation,
  dispatch,
  cityAreas,
  setSelectedAreaIndex,
  map,
  setSelected,
  setZoom,
  setView,
  city,
  areas,
  channels,
}) => {
  const [leftActive, setLeftActive] = useState(device.menu?.left);
  const [rightActive, setRightActive] = useState(device.menu?.right);

  const window = Dimensions.get("window");
  const isSmallDevice = window.width < 800;

  const renderLeftMenu = () => (
    <View style={{ width: 200 }}>
      <ScrollView
        style={{ width: 200 }}
        contentContainerStyle={{
          width: 200,
          height: Platform.OS === "web" ? window.height - 250 : undefined,
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
            renderMenu({
              item: section.header,
              index,
              navigation,
              theme: device.theme,
              dispatch,
              me,
              cityAreas,
              setSelectedAreaIndex,
              map,
              setSelected,
              setZoom,
              city,
              setView,
              areas,
              device,
            })
          }
          renderContent={(section) =>
            section.content.map((item, index) =>
              renderMenu({
                item,
                index,
                navigation,
                theme: device.theme,
                dispatch,
                me,
                cityAreas,
                setSelectedAreaIndex,
                map,
                setSelected,
                setZoom,
                city,
                setView,
                areas,
                device,
              })
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
          height: Platform.OS === "web" ? window.height - 250 : undefined,
        }}
      >
        <Accordion
          expandMultiple
          sections={rightMenu(me, device.theme, areas, channels, device, city)}
          activeSections={rightActive}
          onChange={(active) => {
            setRightActive(active);
            dispatch({
              type: "MENU_SET_RIGHT_ACTIVE_SECTIONS",
              value: active,
            });
          }}
          renderHeader={(section, index) =>
            renderMenu({
              item: section.header,
              index,
              navigation,
              theme: device.theme,
              dispatch,
              me,
              cityAreas,
              setSelectedAreaIndex,
              map,
              setSelected,
              setZoom,
              city,
              areas,
              setView,
              device,
            })
          }
          renderContent={(section) =>
            section.content.map((item, index) =>
              renderMenu({
                item,
                index,
                navigation,
                theme: device.theme,
                dispatch,
                me,
                cityAreas,
                setSelectedAreaIndex,
                map,
                setSelected,
                setZoom,
                city,
                setView,
                areas,
                device,
              })
            )
          }
        />
      </ScrollView>
    </View>
  );

  return isSmallDevice ? (
    children
  ) : (
    <View
      style={{
        flexDirection: "row",
        height: "100%",
        width: "100%",
        position: "absolute",
      }}
      pointerEvents="box-none"
    >
      {me?.id && device.menuShown
        ? !me?.canChooseCity
          ? renderLeftMenu()
          : null
        : null}
      <View style={{ flex: 1 }} pointerEvents="box-none">
        {children}
      </View>
      {me?.id && device.menuShown
        ? !me?.canChooseCity
          ? renderRightMenu()
          : null
        : null}
    </View>
  );
};

export default Menus;
