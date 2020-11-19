import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import { getTextFunction } from "../Util";
import Bank from "./Bank";
import Donate from "./Donate";
import Income from "./Income";
import SwissBank from "./SwissBank";
const AllBanks = (props) => {
  const getText = getTextFunction(props.screenProps.me?.locale);

  const [tab, setTab] = useState("bank");

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabs={[
          {
            title: getText("menuBank"),
            isActive: tab === "bank",
            onPress: () => setTab("bank"),
          },
          {
            title: getText("menuSwissBank"),
            isActive: tab === "swissBank",
            onPress: () => setTab("swissBank"),
          },

          {
            title: getText("menuDonate"),
            isActive: tab === "donate",
            onPress: () => setTab("donate"),
          },
          {
            title: getText("menuIncome"),
            isActive: tab === "income",
            onPress: () => setTab("income"),
          },
        ]}
      />

      {tab === "bank" && <Bank {...props} />}
      {tab === "swissBank" && <SwissBank {...props} />}
      {tab === "donate" && <Donate {...props} />}
      {tab === "income" && <Income {...props} />}
    </View>
  );
};
export default AllBanks;
