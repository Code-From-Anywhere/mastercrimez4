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
import CountDown from "react-native-countdown-component";
import Hoverable from "../../components/Hoverable";
import T from "../../components/T";
import Constants from "../../Constants";
import { getTextFunction, lighterHex } from "../../Util";
import { getObjectMeta, getZoom, objects } from "./MapUtil";

export const isHappyHour = () => {
  const isSunday = moment().day() === 0; //sunday
  const is7pm = moment().hour() === 19; //19pm
  const isHappyHourReleased = moment().isAfter(
    moment("01/02/2021", "DD/MM/YYYY").set("hour", 17)
  );
  return isHappyHourReleased && (isSunday || is7pm);
};

export const InactiveScreens = {
  ACTIONS_BEFORE_ROBBERY: 120,
  ACTIONS_BEFORE_DETECTIVES: 30,
  ACTIONS_BEFORE_BOMB: 60,
  ACTIONS_BEFORE_CASINO: 70,
  ACTIONS_BEFORE_BUNKER: 20,
  ACTIONS_BEFORE_HOSPITAL: 30,
  ACTIONS_BEFORE_RACECARS: 80,
  ACTIONS_BEFORE_STREETRACE: 80,
  ACTIONS_AMOUNT_NEW: 10,
  ACTIONS_BEFORE_ROB: 20,
  ACTIONS_BEFORE_ROB_KILL_MENU: 20,
  ACTIONS_BEFORE_KILL: 30,
  ACTIONS_BEFORE_BULLETFACTORY: 40,
  ACTIONS_BEFORE_MARKET: 50,
  ACTIONS_BEFORE_AIRPORT: 30,
  DAYS_NEW: 14,
  ACTIONS_BEFORE_POLICE: 100,
  OC_RELEASE_DATE: moment("01/08/2021", "DD/MM/YYYY").set("hours", 17),
  DETECTIVES_RELEASE_DATE: moment("01/06/2021", "DD/MM/YYYY").set("hours", 17),
  GANG_MISSIONS_RELEASE_DATE: moment("01/05/2021", "DD/MM/YYYY").set(
    "hours",
    17
  ),
  GANG_BULLET_FACTORY_RELEASE_DATE: moment("15/08/2021", "DD/MM/YYYY").set(
    "hours",
    17
  ),
  PRIZES_NORMAL_RELEASE_DATE: moment("01/12/2020", "DD/MM/YYYY").set(
    "hours",
    17
  ),
  GANG_RELEASE_DATE: moment("30/11/2020", "DD/MM/YYYY").set("hours", 17),
  MARKET_RELEASE_DATE: moment("15/12/2020", "DD/MM/YYYY").set("hours", 17),
  PRIZES_RELEASE_DATE: moment("01/01/2021", "DD/MM/YYYY").set("hours", 17),
  POLICE_RELEASE_DATE: moment("15/01/2021", "DD/MM/YYYY").set("hours", 17),
  ROBBERY_RELEASE_DATE: moment("15/06/2021", "DD/MM/YYYY").set("hours", 17),
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
          view: "crimes",
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
          view: "crimes",
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
          view: "crimes",
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
          view: "crimes",
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
                until={robberySeconds}
                digitStyle={{ backgroundColor: theme.secondary }}
                digitTxtStyle={{ color: theme.secondaryText }}
                onFinish={() => {}}
                size={8}
                timeToShow={["M", "S"]}
                timeLabels={{ m: null, s: null }}
              />
            ) : null,
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
          goToBuilding: "house",
        },

        {
          iconType: "MaterialCommunityIcons",
          icon: "home-analytics",
          text: getText("menuHeadquarter"),
          goToBuilding: "headquarter",
        },

        {
          iconType: "FontAwesome5",
          icon: "beer",
          text: getText("menuSalvationArmy"),
          goToBuilding: "junkies",
        },

        {
          iconType: "AntDesign",
          icon: "heart",
          text: getText("menuSexShop"),
          goToBuilding: "rld",
        },

        {
          iconType: "Entypo",
          icon: "shop",
          text: getText("menuCoffeeShop"),
          goToBuilding: "landlord",
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
          goToBuilding: "bulletFactory",
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
          goToBuilding: "airport",
        },

        {
          view: "game",
          iconType: "FontAwesome",
          icon: "bank",
          text: getText("menuBank"),
          goToBuilding: "bank",
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
          goToBuilding: "casino",
        },

        {
          iconType: "Ionicons",
          icon: "ios-car",
          text: getText("menuGarage"),
          goToBuilding: "garage",
        },

        {
          iconType: "AntDesign",
          icon: "stepforward",
          text: getText("menuGym"),
          goToBuilding: "gym",
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
          inactive: me?.numActions < InactiveScreens.ACTIONS_BEFORE_HOSPITAL,
          isNew:
            me?.numActions <
            InactiveScreens.ACTIONS_BEFORE_HOSPITAL +
              InactiveScreens.ACTIONS_AMOUNT_NEW,

          iconType: "FontAwesome5",
          icon: "hospital",
          text: getText("menuHospital"),
          goToBuilding: "hospital",
        },

        {
          iconType: "FontAwesome",
          icon: "bars",
          text: getText("menuJail", me?.jail),
          goToBuilding: "jail",
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
          goToBuilding: "market",
        },

        {
          view: "game",
          iconType: "Entypo",
          icon: "home",
          text: getText("homeShop"),
          goToBuilding: "estateAgent",
        },

        {
          view: "game",
          iconType: "MaterialCommunityIcons",
          icon: "pistol",
          text: getText("menuWeaponShop"),
          goToBuilding: "weaponShop",
        },

        {
          view: "game",
          iconType: "Entypo",
          icon: "line-graph",
          text: getText("menuStockExchange"),
          goToBuilding: "stockExchange",
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

export const rightMenu = (me, theme, areas, channels) => {
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

  const last10ChannelsMenus = channels.slice(0, 10).map((item) => {
    const channelTitle = item.channel?.name
      ? item.channel?.name
      : item.channel?.channelsubs.length === 2
      ? item.channel?.channelsubs.find((x) => x.userId !== me?.id)?.user?.name
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
      icon: "ios-person",
      to: "Channel",
      params: { subid: item.id, id: item.channel.id },
    };
  });

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
        },

        ...last10ChannelsMenus,
      ].filter((x) => !!x && !x.inactive),
    },

    {
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
          text: getText("menuHackers"),
          to: "Hackers",
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
}) => {
  const TheIcon = Icon[item.iconType];

  const isCurrent = navigation.state.routeName === item.to;
  const TouchOrView = item.isHeader ? View : TouchableOpacity;
  const getText = getTextFunction(me?.locale);
  return (
    <TouchOrView
      key={`item${index}`}
      onPress={(e) => {
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
        if (item.goToBuilding) {
          const objectIndex = objects.findIndex(
            (x) => x.type === item.goToBuilding
          );
          const object = objects[objectIndex];
          const {
            latitude,
            longitude,
            zoom,
            deltaLatitude,
            deltaLongitude,
          } = getObjectMeta({
            city,
            cityAreas,
            index: objectIndex,
            object,
          });

          if (latitude && longitude) {
            if (Platform.OS === "web") {
              map.panTo({
                lat: latitude,
                lng: longitude,
              });

              setZoom(zoom);
            } else {
              map.animateToRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: deltaLatitude,
                longitudeDelta: deltaLongitude,
              });
            }
          }

          setView("game");
          setSelected(item.goToBuilding);
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
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                ) : TheIcon ? (
                  <TheIcon
                    name={item.icon}
                    size={20}
                    color={theme.secondaryText}
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
          sections={rightMenu(me, device.theme, areas, channels)}
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
              setView,
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
      {device.menuShown && renderLeftMenu()}
      <View style={{ flex: 1 }} pointerEvents="box-none">
        {children}
      </View>
      {device.menuShown && renderRightMenu()}
    </View>
  );
};

export default Menus;
