import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import styles from "../Style";
import { doOnce, get, getTextFunction, numberFormat, post } from "../Util";
const { height, width } = Dimensions.get("window");

const SIZE = 100;
const MARGIN = 20;

const Market = ({
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  const [loading, setLoading] = useState(false);
  const [market, setMarket] = useState([]);

  //new offer
  const [response, setResponse] = useState(null);
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [buy, setBuy] = useState(false);
  const [type, setType] = useState(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const getMarket = async () => {
    setLoading(true);

    const { market } = await get(`market`);
    setLoading(false);
    setMarket(market);
  };

  const postMarketCreateOffer = async () => {
    setLoading(true);
    const { response } = await post("marketCreateOffer", {
      token: device.loginToken,
      type,
      price,
      amount,
      buy,
    });
    setLoading(false);
    setResponse(response);
  };

  doOnce(getMarket);

  const chooseType = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const validTypes = ["junkies", "hoeren", "wiet", "gamepoints", "bullets"];

    const options = validTypes.map((type) => getText(type));

    options.push(getText("cancel"));
    const destructiveButtonIndex = undefined;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex < validTypes.length - 1) {
          setType(validTypes[buttonIndex]);
        }
        // Do something here depending on the button index selected
      }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        {loading && <ActivityIndicator />}
        {response && <T>{response}</T>}
      </View>

      <View>
        {/* New offer */}

        <View style={{ marginVertical: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              title={buy ? getText("buy") : getText("sell")}
              onPress={() => setBuy(!buy)}
              style={{ flex: 1, marginVertical: 10, marginLeft: 10 }}
            />

            <TextInput
              placeholderTextColor={theme.secondaryTextSoft}
              style={[styles(theme).textInput, { marginLeft: 10 }]}
              value={amount}
              onChangeText={setAmount}
              placeholder={getText("amount")}
            />

            <Button
              title={type ? getText(type) : getText("whatType")}
              onPress={chooseType}
              style={{ flex: 1, marginVertical: 10, marginLeft: 10 }}
            />

            <T style={{ marginLeft: 10 }}>{getText("for")}</T>

            <TextInput
              placeholderTextColor={theme.secondaryTextSoft}
              style={[styles(theme).textInput, { marginLeft: 10 }]}
              value={price}
              onChangeText={setPrice}
              placeholder={getText("price")}
            />

            <Button
              title={getText("submit")}
              onPress={() => postMarketCreateOffer(true)}
              style={{ flex: 1, marginVertical: 10, marginLeft: 10 }}
            />
          </View>
        </View>

        <FlatList
          data={market}
          numColumns={
            Platform.OS === "web"
              ? undefined
              : Math.floor(width / (SIZE + MARGIN * 2))
          }
          contentContainerStyle={
            Platform.OS === "web"
              ? { flexDirection: "row", flexWrap: "wrap" }
              : undefined
          }
          keyExtractor={(item, index) => `offer${index}`}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: SIZE,
                }}
              >
                <View style={{ flex: 1 }}>
                  <T>{item.buy ? getText("requested") : getText("forSale")}</T>
                </View>

                <T>
                  {item.amount} {getText(item.type)}
                </T>
                <T>€{numberFormat(item.price)},-</T>
              </View>
            );
          }}
        />

        <View style={{ height: 80 }} />
      </View>
    </View>
  );
};

export default Market;
