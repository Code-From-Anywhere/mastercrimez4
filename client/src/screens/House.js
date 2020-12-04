import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import { getTextFunction } from "../Util";
import Bunker from "./Bunker";
import Sint from "./Sint";
import Status from "./Status";
const AllStats = (props) => {
  const getText = getTextFunction(props.screenProps.me?.locale);

  const tabs = [
    {
      key: "status",
      title: getText("menuStatus"),
      component: Status,
    },
    {
      key: "bunker",
      title: getText("menuBunker"),
      component: Bunker,
    },
    {
      key: "sint",
      title: getText("menuSint"),
      component: Sint,
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
