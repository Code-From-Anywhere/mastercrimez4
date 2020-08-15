import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import T from "../components/T";

const Tabs = ({ tabs }) => {
  const theme = useSelector((state) => state.device.theme);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      {tabs.map((tab) => {
        return (
          <TouchableOpacity
            style={{
              flex: 1,
              height: 60,
              backgroundColor: tab.isActive
                ? `${theme.secondary}88`
                : theme.secondary,
              borderRightWidth: 1,
              borderRightColor: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={tab.onPress}
          >
            <T>{tab.title}</T>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Tabs;
