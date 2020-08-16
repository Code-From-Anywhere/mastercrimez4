import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import { doOnce, post } from "../Util";
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
            Dit casino heeft geen eigenaar.
          </Text>
          {becomeOwnerResponse && <T>{becomeOwnerResponse}</T>}
          <Button
            theme={theme}
            title="Word eigenaar"
            onPress={() => becomeOwner(me?.city)}
          />
        </View>
      ) : (
        <>
          <Text style={{ color: theme.primaryText }}>
            De eigenaar van het casino in{" "}
            <Text style={{ fontWeight: "bold" }}>{me?.city}</Text> is{" "}
            <Text style={{ fontWeight: "bold" }}>
              {city?.casinoOwner || "(Niemand)"}
            </Text>
            . De winst is {city?.casinoProfit}
          </Text>

          <Button
            onPress={() => navigation.navigate("Poker")}
            theme={theme}
            title="Poker"
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
            Stad
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
            Eigenaar
          </Text>
          <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
            Winst
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
                    <T>(Niemand)</T>
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
