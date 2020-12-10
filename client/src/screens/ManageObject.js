import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { doOnce, getTextFunction, numberFormat, post } from "../Util";

const ManageObject = ({
  navigation,
  navigation: {
    state: { params },
  },
  screenProps: {
    device,
    me,
    cities,
    reloadCities,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const city = params?.city;
  const type = params?.type;

  const [response, setResponse] = useState(null);
  const [giveTo, setGiveTo] = useState("");
  const [price, setPrice] = useState("");
  const [who, setWho] = useState("");

  const theCity = cities?.find((c) => c.city === city);

  doOnce(reloadCities);

  const getProfit = async () => {
    const { response } = await post("getProfit", {
      token: device.loginToken,
      city,
      type,
    });
    setResponse(response);
    reloadMe(device.loginToken);
    reloadCities();
  };

  const repair = async () => {
    const { response } = await post("repairObject", {
      token: device.loginToken,
      city,
      type,
    });
    setResponse(response);
    reloadMe(device.loginToken);
    reloadCities();
  };

  const giveAway = async () => {
    const { response } = await post("giveAway", {
      token: device.loginToken,
      city,
      type,
      to: giveTo,
    });
    reloadMe(device.loginToken);
    reloadCities();
    setResponse(response);
  };

  const putInJail = async () => {
    const { response } = await post("putInJail", {
      token: device.loginToken,
      city,
      type,
      who,
    });
    reloadMe(device.loginToken);
    reloadCities();
    setResponse(response);
  };

  const changePrice = async () => {
    const { response } = await post("changePrice", {
      token: device.loginToken,
      city,
      type,
      price,
    });
    reloadMe(device.loginToken);
    reloadCities();
    setResponse(response);
  };

  const rowStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  };

  const typeString = getText(type);

  if (!typeString) {
    return <T>{getText("invalidType")}</T>;
  }

  const profitKey = `${type}Profit`;
  const priceKey = `${type}Price`;
  const ownerKey = `${type}Owner`;
  const damageKey = `${type}Damage`;
  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {response && <T>{response}</T>}

      {me?.name && theCity?.[ownerKey] === me?.name ? (
        <View>
          <T style={{ fontWeight: "bold" }}>
            {typeString} {getText("xInX")} {city}
          </T>

          <View style={rowStyle}>
            <T>{getText("profit")}</T>
            <T>€{numberFormat(theCity[profitKey])},-</T>
          </View>

          {theCity[priceKey] && (
            <View style={rowStyle}>
              <T>{getText("price")}</T>
              <T>{theCity[priceKey]}</T>
            </View>
          )}

          <Button
            style={{ marginVertical: 15 }}
            onPress={getProfit}
            theme={theme}
            title={getText("getProfit")}
          />

          <View style={rowStyle}>
            <T>{getText("damage")}</T>
            <T>{theCity[damageKey]}%</T>
          </View>
          <Button
            style={{ marginVertical: 15 }}
            onPress={repair}
            theme={theme}
            title={getText("repair")}
          />

          <View
            style={{
              marginVertical: 15,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              style={{ ...style(theme).textInput, flex: 1 }}
              placeholder={getText("name")}
              placeholderTextColor={theme.secondaryTextSoft}
              value={giveTo}
              onChangeText={(x) => setGiveTo(x)}
            />
            <Button onPress={giveAway} theme={theme} title={getText("give")} />
          </View>

          {type === "bulletFactory" && (
            <View
              style={{
                marginVertical: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                style={{ ...style(theme).textInput, flex: 1 }}
                placeholder={getText("pricePerBullet")}
                placeholderTextColor={theme.secondaryTextSoft}
                value={price}
                onChangeText={(x) => setPrice(x)}
              />
              <Button
                onPress={changePrice}
                theme={theme}
                title={getText("changePrice")}
              />
            </View>
          )}

          {type === "jail" && (
            <View
              style={{
                marginVertical: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                style={{ ...style(theme).textInput, flex: 1 }}
                placeholder={getText("name")}
                placeholderTextColor={theme.secondaryTextSoft}
                value={who}
                onChangeText={(x) => setWho(x)}
              />
              <Button
                onPress={putInJail}
                theme={theme}
                title={getText("putInJail")}
              />
            </View>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
};

export default ManageObject;
