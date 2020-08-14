import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { doOnce, get, post } from "../Util";

const typeStrings = {
  bulletFactory: "Kogelfabriek",
  casino: "Casino",
  landlord: "Huisjesmelker",
  junkies: "Leger des Heils",
  weaponShop: "Wapenwinkel",
  rld: "Red light district",
  airport: "Vliegveld",
  estateAgent: "Makelaar",
  bank: "Bank",
  jail: "Gevangenis",
  garage: "Garage",
};

const Bulletfactory = ({
  navigation,
  navigation: {
    state: { params },
  },
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const city = params?.city;
  const type = params?.type;

  const [response, setResponse] = useState(null);
  const [giveTo, setGiveTo] = useState("");
  const [cities, setCities] = useState(null);
  const [price, setPrice] = useState("");

  const theCity = cities?.find((c) => c.city === city);

  doOnce(async () => {
    fetchCities();
  });

  const fetchCities = async () => {
    const { cities } = await get("cities");
    setCities(cities);
  };

  const getProfit = async () => {
    const { response } = await post("getProfit", {
      token: device.loginToken,
      city,
      type,
    });
    setResponse(response);
    reloadMe(device.loginToken);
    fetchCities();
  };

  const giveAway = async () => {
    const { response } = await post("giveAway", {
      token: device.loginToken,
      city,
      type,
      to: giveTo,
    });
    reloadMe(device.loginToken);
    fetchCities();
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
    fetchCities();
    setResponse(response);
  };

  const rowStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  };

  const typeString = typeStrings[type];

  if (!typeString) {
    return <T>Ongeldig type</T>;
  }
  const profitKey = `${type}Profit`;
  const priceKey = `${type}Price`;
  const ownerKey = `${type}Owner`;
  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {response && <T>{response}</T>}

      {me?.name && theCity?.[ownerKey] === me?.name ? (
        <View>
          <T style={{ fontWeight: "bold" }}>
            {typeString} in {city}
          </T>

          <View style={rowStyle}>
            <T>Winst</T>
            <T>{theCity[profitKey]}</T>
          </View>

          {theCity[priceKey] && (
            <View style={rowStyle}>
              <T>Prijs</T>
              <T>{theCity[priceKey]}</T>
            </View>
          )}

          <Button
            style={{ marginVertical: 15 }}
            onPress={getProfit}
            theme={theme}
            title="Haal winst op"
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
              placeholder="Naam"
              value={giveTo}
              onChangeText={(x) => setGiveTo(x)}
            />
            <Button onPress={giveAway} theme={theme} title="Geef" />
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
                placeholder="Prijs per kogel"
                value={price}
                onChangeText={(x) => setPrice(x)}
              />
              <Button
                onPress={changePrice}
                theme={theme}
                title="Verander prijs"
              />
            </View>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
};

export default Bulletfactory;
