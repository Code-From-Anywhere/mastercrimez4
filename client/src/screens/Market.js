import { useActionSheet } from "@expo/react-native-action-sheet";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-web-refresh-control";
import Button from "../components/Button";
import T from "../components/T";
import User from "../components/User";
import styles from "../Style";
import {
  darkerHex,
  doOnce,
  get,
  getTextFunction,
  numberFormat,
  post,
} from "../Util";

const { height, width } = Dimensions.get("window");

const SIZE = 250;
const MARGIN = 20;

const Market = ({
  navigation,
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
    reloadMe(device.loginToken);
    getMarket();
  };

  const postMarketTransaction = async (offerId) => {
    setLoading(true);
    const { response } = await post("marketTransaction", {
      token: device.loginToken,
      offerId,
    });
    setLoading(false);
    setResponse(response);
    reloadMe(device.loginToken);
    getMarket();
  };

  const postMarketRemoveOffer = async (offerId) => {
    setLoading(true);
    const { response } = await post("marketRemoveOffer", {
      token: device.loginToken,
      offerId,
    });
    setLoading(false);
    setResponse(response);
    reloadMe(device.loginToken);
    getMarket();
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
        if (buttonIndex < validTypes.length) {
          setType(validTypes[buttonIndex]);
        }
        // Do something here depending on the button index selected
      }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        {response && <T>{response}</T>}
      </View>

      <View style={{ flex: 1 }}>
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
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={getMarket} />
          }
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
                  backgroundColor: darkerHex(theme.primary),
                  borderRadius: 15,
                  padding: MARGIN,
                  margin: MARGIN,
                }}
              >
                {item.userId === me?.id && (
                  <TouchableOpacity
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => postMarketRemoveOffer(item.id)}
                  >
                    <Entypo name="cross" color={theme.primaryText} size={24} />
                  </TouchableOpacity>
                )}
                <View style={{ flex: 1 }}>
                  <T>
                    {item.isBuy ? getText("requested") : getText("forSale")}
                  </T>
                </View>

                <User navigation={navigation} user={item.user} />

                <T>
                  {item.amount} {getText(item.type)}
                </T>
                <T>€{numberFormat(item.price)},-</T>

                <Button
                  title={item.isBuy ? getText("sell") : getText("buy")}
                  onPress={() => postMarketTransaction(item.id)}
                />
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
