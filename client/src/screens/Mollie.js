import React, { useState } from "react";
import { Linking, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";

const MollieComplete = ({ screenProps }) => {
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
        console.log("respons", response);
        setResponse(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View style={{ flex: 1 }}>
      {response ? (
        <Button title="Betaal" onPress={() => Linking.openURL(response.url)} />
      ) : (
        <>
          <Button title="Kies optie 1" onPress={() => submit(0)} />
          <Button title="Kies optie 2" onPress={() => submit(1)} />
        </>
      )}
    </View>
  );
};

export default MollieComplete;
