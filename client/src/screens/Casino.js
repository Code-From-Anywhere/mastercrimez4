import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import { doOnce, getTextFunction, post } from "../Util";
const Casino = ({
  navigation,
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

  const [response, setResponse] = useState(null);
  const [becomeOwnerResponse, setBecomeOwnerResponse] = useState(null);

  doOnce(reloadCities);

  const becomeOwner = async (city) => {
    const { response } = await post("becomeOwner", {
      city,
      type: "casino",
      token: device.loginToken,
    });
    reloadCities();
    reloadMe(device.loginToken);
    setBecomeOwnerResponse(response);
  };

  const city = cities?.find((x) => x.city === me?.city);

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {!city?.casinoOwner ? (
        <View>
          <Text style={{ color: theme.primaryText }}>
            {getText("casinoNoOwner")}
          </Text>
          {becomeOwnerResponse && <T>{becomeOwnerResponse}</T>}
          <Button
            title={getText("becomeOwner")}
            onPress={() => becomeOwner(me?.city)}
          />
        </View>
      ) : (
        <>
          <Text style={{ color: theme.primaryText }}>
            {getText("casinoInfo1")}{" "}
            <Text style={{ fontWeight: "bold" }}>{me?.city}</Text>{" "}
            {getText("is")}{" "}
            <Text style={{ fontWeight: "bold" }}>
              {city?.casinoOwner || getText("nobody")}
            </Text>
            . {getText("casinoInfo2", city?.casinoProfit)}
          </Text>

          <Button
            onPress={() => navigation.navigate("Poker")}
            title={getText("poker")}
          />

          {response && (
            <Text style={{ color: theme.primaryText, marginVertical: 20 }}>
              {response}
            </Text>
          )}
        </>
      )}

      <View style={{ height: 80 }} />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 2 }}>
          <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
            {getText("city")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 3,
          }}
        >
          <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
            {getText("owner")}
          </Text>
          <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
            {getText("profit")}
          </Text>
        </View>
      </View>
      {cities?.map((city, index) => {
        return (
          <View
            key={`i${index}`}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "black",
            }}
          >
            <View style={{ flex: 2 }}>
              <T>{city.city}</T>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 3,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {city.casinoOwner ? (
                  <T>{city.casinoOwner}</T>
                ) : (
                  <TouchableOpacity onPress={() => becomeOwner(city.city)}>
                    <T>{getText("nobody")}</T>
                  </TouchableOpacity>
                )}
                {city.casinoOwner === me?.name ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ManageObject", {
                        type: "casino",
                        city: city.city,
                      })
                    }
                  >
                    <Entypo name="edit" color={theme.primaryText} size={12} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <Text style={{ color: theme.primaryText }}>
                {city.casinoProfit}
              </Text>
            </View>
          </View>
        );
      })}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Casino;
