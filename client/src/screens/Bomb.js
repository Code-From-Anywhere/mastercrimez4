import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import style from "../Style";
import { doOnce, getTextFunction, numberFormat, post } from "../Util";

const Bomb = ({
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
  const { showActionSheetWithOptions } = useActionSheet();

  const getText = getTextFunction(me?.locale);

  const [response, setResponse] = useState(null);
  const [bombs, setBombs] = useState(null);
  const [captcha, setCaptcha] = useState("");
  const [type, setType] = useState(navigation.state.params?.type || "");
  const [random, setRandom] = useState(Math.random());

  doOnce(reloadCities);

  const typeStrings = {
    bulletFactory: getText("bulletFactory"),
    casino: getText("casino"),
    landlord: getText("landlord"),
    junkies: getText("junkiesObject"),
    weaponShop: getText("weaponShop"),
    rld: getText("rld"),
    airport: getText("airport"),
    estateAgent: getText("estateAgent"),
    bank: getText("bankObject"),
    jail: getText("jail"),
    garage: getText("garage"),
  };

  const city = cities?.find((x) => x.city === me?.city);

  const submit = async () => {
    const { response } = await post("bomb", {
      loginToken: device.loginToken,
      bombs,
      type,
      captcha,
    });
    reloadMe(device.loginToken);
    setResponse(response);
    reloadCities();
    setCaptcha("");
    setRandom(Math.random());
  };

  const selectType = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html

    const options = Object.keys(typeStrings).map(
      (type) =>
        `${typeStrings[type]} (${city[`${type}Damage`]}% ${getText(
          "damage"
        )}, €${numberFormat(city[`${type}Profit`])} ${getText("profit")})`
    );

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
        if (buttonIndex !== options.length - 1) {
          setType(Object.keys(typeStrings)[buttonIndex]);
        }
        // Do something here depending on the button index selected
      }
    );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {
        <>
          <Image source={require("../../assets/bombarderen.jpg")} />
          <Text style={{ color: theme.primaryText }}>
            {me?.airplane === 0
              ? getText("bombNoAirplane")
              : getText(
                  "bombAirplaneText",
                  airplanes[me?.airplane],
                  me?.airplane * 5
                )}
          </Text>

          {response && (
            <Text style={{ color: theme.primaryText, marginVertical: 20 }}>
              {response}
            </Text>
          )}

          <T style={{ marginTop: 15 }}>{getText("bombs")}</T>
          <TextInput
            placeholder="0"
            placeholderTextColor={theme.secondaryTextSoft}
            value={bombs}
            onChangeText={(x) => setBombs(x)}
            style={style(theme).textInput}
          />

          <T style={{ marginVertical: 15 }}>{getText("property")}</T>
          <Button
            onPress={selectType}
            title={type ? typeStrings[type] : getText("whichProperty")}
          />

          {type ? (
            <T>
              {getText(
                "bombInfo",
                typeStrings[type],
                city[`${type}Damage`],
                numberFormat(city[`${type}Profit`]),
                city[`${type}Owner`] || `(Niemand)`
              )}
            </T>
          ) : null}

          <Captcha
            screenProps={screenProps}
            captcha={captcha}
            onChangeCaptcha={(x) => setCaptcha(x)}
            random={random}
            onChangeRandom={(x) => setRandom(x)}
          />

          <Button
            style={{ marginTop: 15 }}
            title={getText("bombAction")}
            onPress={submit}
          />
        </>
      }

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Bomb;
