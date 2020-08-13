import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";

const Creditshop = ({ screenProps }) => {
  const [items, setItems] = useState(null);
  const { device, reloadMe, me } = screenProps;

  useEffect(() => {
    fetch(`${Constants.SERVER_ADDR}/creditshop`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (response) => {
        setItems(response.items);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const buy = (type) => {
    fetch(`${Constants.SERVER_ADDR}/creditshopBuy`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginToken: device.loginToken,
        type,
      }),
    })
      .then((response) => response.json())
      .then(({ response }) => {
        Alert.alert(response);
        reloadMe(device.loginToken);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View style={{ flex: 1, justifyContent: "space-around" }}>
      <Text style={{ color: device.theme.primaryText, alignSelf: "center" }}>
        Je hebt nog {me?.credits} credits
      </Text>
      {items?.map((item) => (
        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginHorizontal: 20 }}
          title={`${item.kooptext} voor ${item.kosten} credits`}
          onPress={() => {
            buy(item.id);
          }}
        />
      ))}
    </View>
  );
};

export default Creditshop;
