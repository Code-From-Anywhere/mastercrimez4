import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { doOnce, get, post } from "../Util";
const Bulletfactory = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const [response, setResponse] = useState(null);
  const [becomeOwnerResponse, setBecomeOwnerResponse] = useState(null);
  const [bullets, setBullets] = useState(null);
  const [cities, setCities] = useState(null);

  doOnce(async () => {
    fetchCities();
  });

  const becomeOwner = async (city) => {
    const { response } = await post("becomeOwner", {
      city,
      type: "bulletFactory",
      token: device.loginToken,
    });
    fetchCities();
    reloadMe(device.loginToken);
    setBecomeOwnerResponse(response);
  };

  const fetchCities = async () => {
    const { cities } = await get("cities");
    setCities(cities);
  };

  const city = cities?.find((x) => x.city === me?.city);

  const submit = async () => {
    const { response } = await post("buyBullets", {
      loginToken: device.loginToken,
      amount: bullets,
    });
    reloadMe(device.loginToken);
    setResponse(response);
    fetchCities();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {!city?.bulletFactoryOwner ? (
        <View>
          <Text style={{ color: theme.primaryText }}>
            Deze kogelfabriek heeft geen eigenaar.
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
            De eigenaar van de kogelfabriek in{" "}
            <Text style={{ fontWeight: "bold" }}>{me?.city}</Text> is{" "}
            <Text style={{ fontWeight: "bold" }}>
              {city?.bulletFactoryOwner || "(Niemand)"}
            </Text>
            , de prijs per kogel is {city?.bulletFactoryPrice}, en de winst is{" "}
            {city?.bulletFactoryProfit}
          </Text>

          <Text style={{ color: theme.primaryText, marginTop: 20 }}>
            Er zijn nog{" "}
            <Text style={{ fontWeight: "bold" }}>{city?.bullets}</Text> kogels
            beschikbaar
          </Text>

          {response && (
            <Text style={{ color: theme.primaryText, marginVertical: 20 }}>
              {response}
            </Text>
          )}

          <TextInput
            placeholder="0"
            placeholderTextColor={theme.secondaryTextSoft}
            value={bullets}
            onChangeText={(x) => setBullets(x)}
            style={style(theme).textInput}
          />

          <Button theme={theme} title="Koop" onPress={submit} />
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
            Kogels
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
              <Text style={{ color: theme.primaryText }}>{city.city}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 3,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {city.bulletFactoryOwner ? (
                  <Text style={{ color: theme.primaryText }}>
                    {city.bulletFactoryOwner}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={() => becomeOwner(city.city)}>
                    <T>(Niemand)</T>
                  </TouchableOpacity>
                )}
                {city.bulletFactoryOwner === me?.name ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ManageObject", {
                        type: "bulletFactory",
                        city: city.city,
                      })
                    }
                  >
                    <Entypo name="edit" color={theme.primaryText} size={12} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <Text style={{ color: theme.primaryText }}>{city.bullets}</Text>
            </View>
          </View>
        );
      })}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Bulletfactory;
