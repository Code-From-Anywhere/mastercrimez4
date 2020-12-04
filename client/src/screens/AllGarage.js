import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import { getTextFunction } from "../Util";
import Garage from "./Garage";
import Racecars from "./Racecars";
const AllGarage = (props) => {
  const getText = getTextFunction(props.screenProps.me?.locale);

  const tabs = [
    {
      key: "garage",
      title: getText("menuGarage"),
      component: Garage,
    },

    {
      key: "racecars",
      title: getText("menuRacecars"),
      component: Racecars,
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
export default AllGarage;
