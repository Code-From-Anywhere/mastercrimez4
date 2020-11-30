import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { getTextFunction, post } from "../Util";
const Lotto = ({
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
  const [type, setType] = useState("lottoDay");
  const buy = async () => {
    const { response } = await post("buyLotto", {
      token: device.loginToken,
      amount,
      type,
    });

    setResponse(response);
    reloadMe(device.loginToken);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <View style={{ flex: 1, margin: 20 }}>
        <View>
          {response ? <T>{response}</T> : null}
          <View>
            <T>{getText("youHaveDayTickets", me?.lottoDay)}</T>
            <T>{getText("youHaveWeekTickets", me?.lottoWeek)}</T>
            <T>{getText("youHaveMonthTickets", me?.lottoMonth)}</T>

            <T bold style={{ marginTop: 20 }}>
              {getText("buy")}
            </T>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[style(theme).textInput, { flex: 1 }]}
                placeholder={getText("amount")}
                placeholderTextColor={theme.secondaryTextSoft}
                value={amount}
                onChangeText={(amount) => setAmount(amount)}
              />

              <Button
                style={{ marginVertical: 10, marginLeft: 10 }}
                title={
                  type === "lottoDay"
                    ? getText("dayLotto")
                    : type === "lottoWeek"
                    ? getText("weekLotto")
                    : getText("monthLotto")
                }
                onPress={() => {
                  setType(
                    type === "lottoDay"
                      ? "lottoWeek"
                      : type === "lottoWeek"
                      ? "lottoMonth"
                      : "lottoDay"
                  );
                }}
              />
            </View>

            <Button
              theme={theme}
              title={getText("buy")}
              onPress={() => buy()}
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
export default Lotto;
