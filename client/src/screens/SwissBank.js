import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { doOnce, get, post } from "../Util";
const SwissBank = ({
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
  const [cities, setCities] = useState(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("bank");
  doOnce(async () => {
    fetchCities();
  });

  const becomeOwner = async (city) => {
    const { response } = await post("becomeOwner", {
      city,
      type: "bank",
      token: device.loginToken,
    });
    fetchCities();
    reloadMe(device.loginToken);
    setBecomeOwnerResponse(response);
  };

  const deposit = async (deposit) => {
    const { response } = await post("swissBank", {
      token: device.loginToken,
      amount,
      deposit,
      type,
    });

    setResponse(response);
    reloadMe(device.loginToken);
  };

  const fetchCities = async () => {
    const { cities } = await get("cities");
    setCities(cities);
  };

  const keyValue = (key, value, onPress) => {
    return (
      <View style={styles.row}>
        <T hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>{key}</T>
        <TouchableOpacity
          disabled={!onPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onPress}
        >
          <T>{value}</T>
        </TouchableOpacity>
      </View>
    );
  };
  const city = cities?.find((x) => x.city === me?.city);

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <View style={{ flex: 1, margin: 20 }}>
        <View>
          {response ? <T>{response}</T> : null}
          {keyValue("Bank", Intl.NumberFormat().format(me?.bank), () =>
            setAmount(String(me.bank))
          )}
          {keyValue(
            "Zwitserse bank",
            Intl.NumberFormat().format(me?.swissBank),
            () => setAmount(String(me.swissBank))
          )}

          {keyValue("Kosten", "2% per dag")}

          {keyValue("Kogels", Intl.NumberFormat().format(me?.bullets), () =>
            setAmount(String(me.bullets))
          )}
          {keyValue(
            "Zwitserse kogelbank",
            Intl.NumberFormat().format(me?.swissBullets),
            () => setAmount(String(me.swissBullets))
          )}

          {keyValue("Kosten", "2% per dag")}

          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{ ...style(theme).textInput, flex: 1 }}
                placeholder="Hoeveelheid"
                placeholderTextColor={theme.secondaryTextSoft}
                value={amount}
                onChangeText={(amount) => setAmount(amount)}
              />

              <TouchableOpacity
                style={{
                  backgroundColor: theme.secondary,
                  padding: 10,
                  borderRadius: 5,
                  marginLeft: 10,
                }}
                onPress={() => setType(type === "bank" ? "bullets" : "bank")}
              >
                <T>{type === "bank" ? "Bankgeld" : "Kogels"}</T>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Button
                theme={theme}
                title="In"
                onPress={() => deposit(true)}
                style={{ width: 80 }}
              />
              <Button
                theme={theme}
                title="Uit"
                onPress={() => deposit(false)}
                style={{ width: 80 }}
              />
            </View>
          </View>
        </View>
      </View>

      {!city?.bankOwner ? (
        <View>
          <Text style={{ color: theme.primaryText }}>
            Dit zwitserse bank heeft geen eigenaar.
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
            De eigenaar van de zwisterse bank in{" "}
            <Text style={{ fontWeight: "bold" }}>{me?.city}</Text> is{" "}
            <Text style={{ fontWeight: "bold" }}>
              {city?.bankOwner || "(Niemand)"}
            </Text>
            . De eigenaar krijgt 50% van de kosten van de zwitserse bank. Er
            zijn 5% transactiekosten. De winst is {city?.bankProfit}
          </Text>

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
                {city.bankOwner ? (
                  <T>{city.bankOwner}</T>
                ) : (
                  <TouchableOpacity onPress={() => becomeOwner(city.city)}>
                    <T>(Niemand)</T>
                  </TouchableOpacity>
                )}
                {city.bankOwner === me?.name ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ManageObject", {
                        type: "bank",
                        city: city.city,
                      })
                    }
                  >
                    <Entypo name="edit" color={theme.primaryText} size={12} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <Text style={{ color: theme.primaryText }}>
                {city.bankProfit}
              </Text>
            </View>
          </View>
        );
      })}

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
export default SwissBank;
