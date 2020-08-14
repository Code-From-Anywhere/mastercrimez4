import React, { useState } from "react";
import { Text, View } from "react-native";
import Button from "../components/Button";
import { doOnce, get, post } from "../Util";

const Creditshop = ({ screenProps }) => {
  const [items, setItems] = useState(null);
  const [response, setResponse] = useState(null);

  const {
    device,
    device: { theme },
    reloadMe,
    me,
  } = screenProps;

  doOnce(async () => {
    const { items } = await get("creditshop");
    setItems(items);
  });

  const buy = async (type) => {
    const { response } = await post("creditshopBuy", {
      loginToken: device.loginToken,
      type,
    });
    setResponse(response);
    reloadMe(device.loginToken);
  };
  return (
    <View style={{ flex: 1, justifyContent: "space-around" }}>
      <Text style={{ color: device.theme.primaryText, alignSelf: "center" }}>
        Je hebt nog {me?.credits} credits
      </Text>

      {response && (
        <Text style={{ color: device.theme.primaryText, alignSelf: "center" }}>
          {response}
        </Text>
      )}

      {items?.map((item) => (
        <Button
          theme={theme}
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
