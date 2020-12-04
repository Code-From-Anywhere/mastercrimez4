import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import { getTextFunction } from "../Util";
import GangCreate from "./GangCreate";
import GangMissions from "./GangMissions";
import GangSettings from "./GangSettings";
import GangShop from "./GangShop";
const AllGang = (props) => {
  const getText = getTextFunction(props.screenProps.me?.locale);

  const tabs = [
    {
      key: "gangCreate",
      title: getText("menuGangCreate"),
      component: GangCreate,
    },

    {
      key: "gangSettings",
      title: getText("menuGangSettings"),
      component: GangSettings,
    },
    {
      key: "gangShop",
      title: getText("menuGangShop"),
      component: GangShop,
    },
    {
      key: "gangMissions",
      title: getText("menuGangMissions"),
      component: GangMissions,
    },
  ];

  const [tab, setTab] = useState(tabs[0].key);
  const Component = tabs.find((t) => t.key === tab).component;
  return (
    <View style={{ flex: 1 }}>
      <Component {...props} />

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
export default AllGang;
