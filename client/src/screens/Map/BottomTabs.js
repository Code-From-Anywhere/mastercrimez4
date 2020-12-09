import * as Icon from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import MapIcon from "./MapIcon";
import { animateToCity } from "./MapUtil";
const BottomTabs = ({
  view,
  setSelected,
  navigation,
  setView,
  dragAndDropMode,
  setDragAndDropMode,
  level,
  chatBadgeCount,
  territoriesBadgeCount,
  crimesBadgeCount,
  gameBadgeCount,
  map,
  city,
}) => {
  const dispatch = useDispatch();
  return (
    <View
      pointerEvents="box-none"
      style={{
        zIndex: 2,
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
            animateToCity({ map, dispatch, city });
          },
          badgeCount: gameBadgeCount,
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
            animateToCity({ map, dispatch, city });
          },
          badgeCount: crimesBadgeCount,
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
            animateToCity({ map, dispatch, city });
          },
          badgeCount: territoriesBadgeCount,
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
          badgeCount: chatBadgeCount,
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

export default BottomTabs;
