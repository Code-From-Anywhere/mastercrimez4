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
import Captcha from "../components/Captcha";
import T from "../components/T";
import style from "../Style";
import { doOnce, getTextFunction, post } from "../Util";
const Bulletfactory = ({
  navigation,
  screenProps,
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
  const [bullets, setBullets] = useState(null);
  const [captcha, setCaptcha] = useState("");
  const [random, setRandom] = useState(Math.random());

  doOnce(reloadCities);

  const becomeOwner = async (city) => {
    const { response } = await post("becomeOwner", {
      city,
      type: "bulletFactory",
      token: device.loginToken,
    });
    reloadCities();
    reloadMe(device.loginToken);
    setBecomeOwnerResponse(response);
  };

  const city = cities?.find((x) => x.city === me?.city);

  const submit = async () => {
    const { response } = await post("buyBullets", {
      loginToken: device.loginToken,
      amount: bullets,
      captcha,
    });
    reloadMe(device.loginToken);
    setResponse(response);
    reloadCities();
    setCaptcha("");
    setRandom(Math.random());
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {!city?.bulletFactoryOwner ? (
        <View>
          <Text style={{ color: theme.primaryText }}>
            {getText("bulletfactoryNoOwner")}
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
            {getText("bulletfactoryInfo1")}{" "}
            <Text style={{ fontWeight: "bold" }}>{me?.city}</Text>{" "}
            {getText("is")}{" "}
            <Text style={{ fontWeight: "bold" }}>
              {city?.bulletFactoryOwner || getText("nobody")}
            </Text>
            ,{" "}
            {getText(
              "bulletfactoryInfo2",
              city?.bulletFactoryPrice,
              city?.bulletFactoryProfit
            )}
          </Text>

          <Text style={{ color: theme.primaryText, marginTop: 20 }}>
            {getText("bulletfactoryInfo3")}{" "}
            <Text style={{ fontWeight: "bold" }}>{city?.bullets}</Text>{" "}
            {getText("bulletfactoryInfo4")}
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

          <Captcha
            screenProps={screenProps}
            captcha={captcha}
            onChangeCaptcha={(x) => setCaptcha(x)}
            random={random}
            onChangeRandom={(x) => setRandom(x)}
          />

          <Button theme={theme} title={getText("buy")} onPress={submit} />
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
            {getText("bullets")}
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
                    <T>{getText("nobody")}</T>
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
            {getText("damage")}
          </Text>
          <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
            {getText("pricePerBullet")}
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
                <T>{city.bulletFactoryDamage}%</T>
              </View>

              <Text style={{ color: theme.primaryText }}>
                €{city.bulletFactoryPrice}
              </Text>
            </View>
          </View>
        );
      })}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Bulletfactory;
