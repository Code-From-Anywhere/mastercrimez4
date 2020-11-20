import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { doOnce, getTextFunction, post } from "../Util";
const GangCreate = ({
  navigation,
  screenProps: {
    device,
    me,
    cities,
    reloadMe,
    reloadCities,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [response, setResponse] = useState(null);
  const [becomeOwnerResponse, setBecomeOwnerResponse] = useState(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("bank");
  doOnce(reloadCities);

  const becomeOwner = async (city) => {
    const { response } = await post("becomeOwner", {
      city,
      type: "bank",
      token: device.loginToken,
    });
    reloadCities();
    reloadMe(device.loginToken);
    setBecomeOwnerResponse(response);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default GangCreate;
