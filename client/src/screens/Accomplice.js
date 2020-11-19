import React, { useEffect, useState } from "react";
import {
  Clipboard,
  Dimensions,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { default as style, default as styles } from "../Style";
import { getRank, getTextFunction } from "../Util";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

const Accomplice = ({
  navigation,
  screenProps: {
    me,
    device,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [accomplice1, setAccomplice1] = useState(me?.accomplice);
  const [accomplice2, setAccomplice2] = useState(me?.accomplice2);
  const [accomplice3, setAccomplice3] = useState(me?.accomplice3);
  const [accomplice4, setAccomplice4] = useState(me?.accomplice4);
  const [response, setResponse] = useState(null);

  const submit = (acc) => {
    //how to set accomplice acc from params to the right body?

    fetch(`${Constants.SERVER_ADDR}/setAccomplice`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accomplice: accomplice1,
        accomplice2,
        accomplice3,
        accomplice4,
        loginToken: device.loginToken,
      }),
    })
      .then((response) => response.json())
      .then(({ response }) => {
        setResponse(response);
        reloadMe(device.loginToken);
      })
      .catch((error) => {
        console.log("upload error", error);
        alert(getText("somethingWentWrong"));
      });
  };

  const keyValue = (key, value) => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          height: 40,
          alignItems: "center",
        }}
      >
        <T>{key}</T>
        <T>{value}</T>
      </View>
    );
  };

  useEffect(() => {
    const accomplice = navigation.state.params?.accomplice;
    if (accomplice) {
      submit(accomplice);
    }
  }, []);

  const rank = getRank(me?.rank, "number");
  const url = `https://mastercrimez.nl/#/Accomplice?accomplice=${me?.name}`;
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <View style={{ maxWidth: 600, margin: 20 }}>
        <T>{getText("accompliceInfo")}</T>

        <View style={{ marginBottom: 20 }}>
          <T>{getText("accompliceLinkText")}</T>
          <TextInput
            value={url}
            onFocus={() => {
              Clipboard.setString(url);
              setResponse(getText("copiedToClipboard"));
            }}
            style={style(theme).textInput}
          />
        </View>

        <T bold>{getText("yourAccomplicesHeader")}</T>
        {me?.accomplices.length > 0 ? (
          me?.accomplices.map((accomplice) => {
            return keyValue(accomplice.name, getRank(accomplice.rank, "both"));
          })
        ) : (
          <T>{getText("accomplicesNone")}</T>
        )}

        <T bold style={{ marginTop: 15 }}>
          {getText("accompliceWhoseYouWantToBe")}
        </T>
        <T>{response}</T>

        <TextInput
          placeholderTextColor={theme.secondaryTextSoft}
          style={styles(theme).textInput}
          value={accomplice1}
          onChangeText={setAccomplice1}
          placeholder={getText("accomplice", 1)}
        />

        {rank >= 11 ? (
          <TextInput
            placeholderTextColor={theme.secondaryTextSoft}
            style={styles(theme).textInput}
            value={accomplice2}
            onChangeText={setAccomplice2}
            placeholder={getText("accomplice", 2)}
          />
        ) : null}

        {rank >= 16 ? (
          <>
            <TextInput
              placeholderTextColor={theme.secondaryTextSoft}
              style={styles(theme).textInput}
              value={accomplice3}
              onChangeText={setAccomplice3}
              placeholder={getText("accomplice", 3)}
            />

            <TextInput
              style={styles(theme).textInput}
              value={accomplice4}
              placeholderTextColor={theme.secondaryTextSoft}
              onChangeText={setAccomplice4}
              placeholder={getText("accomplice", 4)}
            />
          </>
        ) : null}

        <Button theme={theme} title={getText("save")} onPress={submit} />
      </View>
    </ScrollView>
  );
};

export default Accomplice;
