import React, { useState } from "react";
import { View } from "react-native";
import Tabs from "../components/Tabs";
import { getTextFunction } from "../Util";
import Creditshop from "./Creditshop";
import Mollie from "./Mollie";
import SuperMessage from "./SuperMessage";

const VIP = (props) => {
  const [tab, setTab] = useState("mollie");

  const getText = getTextFunction(props.screenProps.me?.locale);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabs={[
          {
            title: getText("buyCredits"),
            isActive: tab === "mollie",
            onPress: () => setTab("mollie"),
          },
          {
            title: getText("creditshop"),
            isActive: tab === "creditshop",
            onPress: () => setTab("creditshop"),
          },

          {
            title: getText("superMessage"),
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
