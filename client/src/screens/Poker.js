import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { getTextFunction, post } from "../Util";
const Poker = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [response, setResponse] = useState(null);
  const [amount, setAmount] = useState("");

  const poker = async () => {
    const { response } = await post("poker", {
      loginToken: device.loginToken,
      amount,
    });

    setResponse(response);
    reloadMe(device.loginToken);
  };

  const keyValue = (key, value) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          height: 40,
          alignItems: "center",
        }}
      >
        <T>{key}</T>
        <T>{value}</T>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {keyValue(getText("cash"), `€${me?.cash}`)}
      {keyValue(getText("bank"), `€${me?.bank}`)}
      {keyValue(getText("swissBank"), `€${me?.swissBank}`)}

      <View style={{ flex: 1, margin: 20 }}>
        <View>
          {response ? <T>{response}</T> : null}
          <View>
            <TextInput
              style={{ ...style(theme).textInput, flex: 1 }}
              placeholder={getText("amount")}
              placeholderTextColor={theme.secondaryTextSoft}
              value={amount}
              onChangeText={(amount) => setAmount(amount)}
            />

            <Button
              theme={theme}
              title={getText("gamble")}
              onPress={() => poker()}
              style={{ width: 80 }}
            />
          </View>
        </View>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignItems: "center",
  },
});
export default Poker;
