import React from "react";
import { Linking, Platform, Text, View } from "react-native";
import Button from "../components/Button";
import { getTextFunction, post } from "../Util";
const Mollie = ({
  screenProps: {
    device,
    me,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const submit = async (item) => {
    const response = await post("mollieCreate", {
      token: device.loginToken,
      item,
    });

    if (response.url) {
      Linking.openURL(response.url);
    }
  };
  return Platform.OS === "ios" ? (
    <Text style={{ color: theme.primaryText }}>
      {getText("canOnlyBuyCreditsOnWebsite")}
    </Text>
  ) : (
    <View style={{ flex: 1, justifyContent: "space-around" }}>
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title={getText("mollie0")}
        onPress={() => submit(0)}
      />
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title={getText("mollie1")}
        onPress={() => submit(1)}
      />
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title={getText("mollie2")}
        onPress={() => submit(2)}
      />

      <Text style={{ color: theme.primaryText }}>{getText("mollieRules")}</Text>
    </View>
  );
};

export default Mollie;
