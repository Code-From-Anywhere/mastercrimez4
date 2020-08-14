import React from "react";
import { Linking, View } from "react-native";
import Button from "../components/Button";
import { post } from "../Util";
const Mollie = ({
  screenProps: {
    device,
    device: { theme },
  },
}) => {
  const submit = async (item) => {
    const response = await post("mollieCreate", {
      token: device.loginToken,
      item,
    });

    if (response.url) {
      Linking.openURL(response.url);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "space-around" }}>
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 1000 credits voor €10"
        onPress={() => submit(0)}
      />
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 6000 credits voor €50"
        onPress={() => submit(1)}
      />
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 40000 credits voor €250"
        onPress={() => submit(2)}
      />
    </View>
  );
};

export default Mollie;
