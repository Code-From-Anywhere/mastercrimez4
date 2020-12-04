import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import { getTextFunction } from "../Util";
import Info from "./Info";
import Police from "./Police";
import Settings from "./Settings";
const AllStats = (props) => {
  const getText = getTextFunction(props.screenProps.me?.locale);

  const tabs = [
    {
      key: "settings",
      title: getText("menuSettings"),
      component: Settings,
    },
    {
      key: "info",
      title: getText("menuInfo"),
      component: Info,
    },
    {
      key: "police",
      title: getText("menuPolice"),
      component: Police,
    },
  ];

  const [tab, setTab] = useState(tabs[0].key);
  const Component = tabs.find((t) => t.key === tab).component;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Component {...props} />
      </View>
      <Tabs
        tabs={tabs.map((t) => ({
          title: t.title,
          isActive: tab === t.key,
          onPress: () => setTab(t.key),
        }))}
      />
    </View>
  );
};
export default AllStats;
