import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import Bank from "./Bank";
import Donate from "./Donate";
import Income from "./Income";
import SwissBank from "./SwissBank";
const AllBanks = (props) => {
  const [tab, setTab] = useState("bank");

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabs={[
          {
            title: "Bank",
            isActive: tab === "bank",
            onPress: () => setTab("bank"),
          },
          {
            title: "Zwitserse bank",
            isActive: tab === "swissBank",
            onPress: () => setTab("swissBank"),
          },

          {
            title: "Doneren",
            isActive: tab === "donate",
            onPress: () => setTab("donate"),
          },
          {
            title: "Inkomen",
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
