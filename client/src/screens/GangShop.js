import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  TextInput,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import styles from "../Style";
import { getTextFunction, numberFormat, post } from "../Util";
const MARGIN = 20;
const { width, height } = Dimensions.get("window");
const SIZE = width < 1000 ? 100 : 200;
const GangShop = ({
  navigation,
  screenProps: {
    device,
    me,
    cities,
    reloadMe,
    reloadCities,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const prices = [
    null,
    50000,
    100000,
    200000,
    500000,
    1000000,
    1500000,
    2000000,
    3000000,
    4000000,
    5000000,
    10000000,
    20000000,
  ];

  const items = [
    {
      name: getText("gangShopItem1"),
      price: prices[1],
      current: me?.gang?.item1,
      image: require("../../assets/gangshop/item1.jpg"),
    },
    {
      name: getText("gangShopItem2"),
      price: prices[2],
      current: me?.gang?.item2,
      image: require("../../assets/gangshop/item2.jpg"),
    },
    {
      name: getText("gangShopItem3"),
      price: prices[3],
      current: me?.gang?.item3,
      image: require("../../assets/gangshop/item3.jpg"),
    },
    {
      name: getText("gangShopItem4"),
      price: prices[4],
      current: me?.gang?.item4,
      image: require("../../assets/gangshop/item4.jpg"),
    },
    {
      name: getText("gangShopItem5"),
      price: prices[5],
      current: me?.gang?.item5,
      image: require("../../assets/gangshop/item5.jpg"),
    },
    {
      name: getText("gangShopItem6"),
      price: prices[6],
      current: me?.gang?.item6,
      image: require("../../assets/gangshop/item6.jpg"),
    },
    {
      name: getText("gangShopItem7"),
      price: prices[7],
      current: me?.gang?.item7,
      image: require("../../assets/gangshop/item7.jpg"),
    },
    {
      name: getText("gangShopItem8"),
      price: prices[8],
      current: me?.gang?.item8,
      image: require("../../assets/gangshop/item8.jpg"),
    },
    {
      name: getText("gangShopItem9"),
      price: prices[9],
      current: me?.gang?.item9,
      image: require("../../assets/gangshop/item9.jpg"),
    },
    {
      name: getText("gangShopItem10"),
      price: prices[10],
      current: me?.gang?.item10,
      image: require("../../assets/gangshop/item10.jpg"),
    },
    {
      name: getText("gangShopItem11"),
      price: prices[11],
      current: me?.gang?.item11,
      image: require("../../assets/gangshop/item11.jpg"),
    },
    {
      name: getText("gangShopItem12"),
      price: prices[12],
      current: me?.gang?.item12,
      image: require("../../assets/gangshop/item12.jpg"),
    },
  ];

  const [response, setResponse] = useState(null);
  const [amount, setAmount] = useState({});
  const [loading, setLoading] = useState(false);

  const postGangShop = async (itemId) => {
    setLoading(true);
    const { response } = await post("gangShop", {
      itemId,
      amount: amount[itemId],
      token: device.loginToken,
    });
    reloadMe(device.loginToken);
    setResponse(response);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 15 }}>
      {response && <T>{response}</T>}
      <T>
        {getText("gangBank")}: €{numberFormat(me?.gang?.bank || 0)},-
      </T>
      <T>
        {getText("power")}: {me?.gang?.power}
      </T>
      <FlatList
        refreshing={loading}
        onRefresh={() => reloadMe(device.loginToken)}
        data={items}
        numColumns={
          Platform.OS === "web"
            ? undefined
            : Math.floor(width / (SIZE + MARGIN * 2))
        }
        contentContainerStyle={
          Platform.OS === "web"
            ? { flexDirection: "row", flexWrap: "wrap", height: height - 200 }
            : undefined
        }
        keyExtractor={(item, index) => `shop${index}`}
        renderItem={({ item, index }) => {
          return (
            <View style={{ margin: MARGIN }}>
              <Image
                source={item.image}
                style={{ width: SIZE, height: SIZE }}
                resizeMode="contain"
              />
              <T>{item.name}</T>
              <T>€{item.price},-</T>
              <T>
                {getText("inPossession")}: {item.current}
              </T>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  placeholderTextColor={theme.secondaryTextSoft}
                  style={[styles(theme).textInput, { width: 100 }]}
                  value={amount[index + 1] || ""}
                  onChangeText={(v) => setAmount({ ...amount, [index + 1]: v })}
                  placeholder={getText("amount")}
                />
                <Button
                  style={{ marginVertical: 10, marginLeft: 10 }}
                  title={getText("buy")}
                  onPress={() => postGangShop(index + 1)}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default GangShop;
