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
import { doOnce, getTextFunction, numberFormat, post } from "../Util";
const SwissBank = ({
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

  const [response, setResponse] = useState(null);
  const [becomeOwnerResponse, setBecomeOwnerResponse] = useState(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("bank");
  doOnce(reloadCities);

  const becomeOwner = async (city) => {
    const { response } = await post("becomeOwner", {
      city,
      type: "bank",
      token: device.loginToken,
    });
    reloadCities();
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
          {keyValue(getText("bank"), numberFormat(me?.bank), () =>
            setAmount(String(me.bank))
          )}
          {keyValue(getText("swissBank"), numberFormat(me?.swissBank), () =>
            setAmount(String(me.swissBank))
          )}

          {keyValue(getText("costs"), getText("swissBankCost"))}

          {keyValue(getText("bullets"), numberFormat(me?.bullets), () =>
            setAmount(String(me.bullets))
          )}
          {keyValue(
            getText("swissBulletBank"),
            numberFormat(me?.swissBullets),
            () => setAmount(String(me.swissBullets))
          )}

          {keyValue(getText("costs"), getText("swissBulletBankCost"))}

          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{ ...style(theme).textInput, flex: 1 }}
                placeholder={getText("amount")}
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
                <T>
                  {type === "bank" ? getText("bankMoney") : getText("bullets")}
                </T>
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
                title={getText("in")}
                onPress={() => deposit(true)}
                style={{ width: 80 }}
              />
              <Button
                theme={theme}
                title={getText("out")}
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
            {getText("swissBankNoOwner")}
          </Text>
          {becomeOwnerResponse && <T>{becomeOwnerResponse}</T>}
          <Button
            theme={theme}
            title={getText("becomeOwner")}
            onPress={() => becomeOwner(me?.city)}
          />
        </View>
      ) : (
        <>
          <Text style={{ color: theme.primaryText }}>
            {getText("swissBankInfo1")}{" "}
            <Text style={{ fontWeight: "bold" }}>{me?.city}</Text>{" "}
            {getText("is")}{" "}
            <Text style={{ fontWeight: "bold" }}>
              {city?.bankOwner || getText("nobody")}
            </Text>
            . {getText("swissBankInfo2", city?.bankProfit)}
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
                {city.bankOwner ? (
                  <T>{city.bankOwner}</T>
                ) : (
                  <TouchableOpacity onPress={() => becomeOwner(city.city)}>
                    <T>{getText("nobody")}</T>
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
