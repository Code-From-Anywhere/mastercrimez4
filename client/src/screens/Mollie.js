import React, { useState } from "react";
import { Linking, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";

const Mollie = ({ screenProps }) => {
  const [response, setResponse] = useState(null);

  const submit = (item) => {
    const { device } = screenProps;

    fetch(`${Constants.SERVER_ADDR}/mollieCreate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        item,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.url) {
          Linking.openURL(response.url);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View style={{ flex: 1, justifyContent: "space-around" }}>
      <Button
        theme={this.props.screenProps.device.theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 1000 credits voor €10"
        onPress={() => submit(0)}
      />
      <Button
        theme={this.props.screenProps.device.theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 6000 credits voor €50"
        onPress={() => submit(1)}
      />
      <Button
        theme={this.props.screenProps.device.theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 40000 credits voor €250"
        onPress={() => submit(2)}
      />
    </View>
  );
};

export default Mollie;
