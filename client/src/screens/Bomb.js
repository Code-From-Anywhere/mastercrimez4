import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import style from "../Style";
import { doOnce, numberFormat, post } from "../Util";

const typeStrings = {
  bulletFactory: "Kogelfabriek",
  casino: "Casino",
  landlord: "Huisjesmelker",
  junkies: "Leger des Heils",
  weaponShop: "Wapenwinkel",
  rld: "Red light district",
  airport: "Vliegveld",
  estateAgent: "Makelaarskantoor",
  bank: "Zwitserse Bank",
  jail: "Gevangenis",
  garage: "Garage",
};

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

  const [response, setResponse] = useState(null);
  const [becomeOwnerResponse, setBecomeOwnerResponse] = useState(null);
  const [bombs, setBombs] = useState(null);
  const [captcha, setCaptcha] = useState("");
  const [type, setType] = useState("");
  const [random, setRandom] = useState(Math.random());

  doOnce(reloadCities);

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

  const airplanes = [
    "",
    "Fokker",
    "Fleet",
    "Havilland",
    "Cessna",
    "Douglas",
    "Lear Jet",
    "Raket",
  ];

  const selectType = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html

    const options = Object.keys(typeStrings).map(
      (type) =>
        `${typeStrings[type]} (${
          city[`${type}Damage`]
        }% schade, €${numberFormat(city[`${type}Profit`])} winst)`
    );

    options.push("Cancel");
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
              ? `Jij hebt nog geen vliegtuig, dus kan niet bombarderen`
              : `Jij hebt een ${airplanes[me?.airplane]}. Hiermee kan je ${
                  me?.airplane * 5
                } bommen gooien. Één bom kost €50.000,-`}
          </Text>

          {response && (
            <Text style={{ color: theme.primaryText, marginVertical: 20 }}>
              {response}
            </Text>
          )}

          <T style={{ marginTop: 15 }}>Bommen</T>
          <TextInput
            placeholder="0"
            placeholderTextColor={theme.secondaryTextSoft}
            value={bombs}
            onChangeText={(x) => setBombs(x)}
            style={style(theme).textInput}
          />

          <T style={{ marginVertical: 15 }}>Bezitting</T>
          <Button
            theme={theme}
            onPress={selectType}
            title={type ? typeStrings[type] : "Welke bezitting?"}
          />

          {type ? (
            <T>{`Deze ${typeStrings[type]} heeft ${
              city[`${type}Damage`]
            }% schade, en €${numberFormat(
              city[`${type}Profit`]
            )} winst. De eigenaar is nu ${
              city[`${type}Owner`] || `(Niemand)`
            }`}</T>
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
            theme={theme}
            title="Bommen los"
            onPress={submit}
          />
        </>
      }

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Bomb;
