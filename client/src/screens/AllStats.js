import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import { getTextFunction } from "../Util";
import Gangs from "./Gangs";
import Members from "./Members";
import Prizes from "./Prizes";
import Properties from "./Properties";
import Stats from "./Stats";
const AllStats = (props) => {
  const getText = getTextFunction(props.screenProps.me?.locale);

  const tabs = [
    {
      key: "members",
      title: getText("menuMembers", props.screenProps.me?.online),
      component: Members,
    },
    {
      key: "stats",
      title: getText("menuStats"),
      component: Stats,
    },
    {
      key: "gangs",
      title: getText("menuGangs"),
      component: Gangs,
    },
    {
      key: "prizes",
      title: getText("prizes"),
      component: Prizes,
    },

    {
      key: "properties",
      title: getText("menuProperties"),
      component: Properties,
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
export default AllStats;
