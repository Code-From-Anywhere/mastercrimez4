import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import Creditshop from "./Creditshop";
import Mollie from "./Mollie";
import SuperMessage from "./SuperMessage";

const VIP = (props) => {
  const [tab, setTab] = useState("mollie");

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabs={[
          {
            title: "Credits Kopen",
            isActive: tab === "mollie",
            onPress: () => setTab("mollie"),
          },
          {
            title: "Creditshop",
            isActive: tab === "creditshop",
            onPress: () => setTab("creditshop"),
          },

          {
            title: "Super bericht",
            isActive: tab === "supermessage",
            onPress: () => setTab("supermessage"),
          },
        ]}
      />

      {tab === "mollie" && <Mollie {...props} />}
      {tab === "creditshop" && <Creditshop {...props} />}
      {tab === "supermessage" && <SuperMessage {...props} />}
    </View>
  );
};
export default VIP;
