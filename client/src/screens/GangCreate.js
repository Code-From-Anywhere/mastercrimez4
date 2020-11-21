import React, { useState } from "react";
import { ScrollView, TextInput } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { getTextFunction, post } from "../Util";
const GangCreate = ({
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
  const [name, setName] = useState("");

  const postGangCreate = async () => {
    const { response } = await post("gangCreate", {
      name,
      token: device.loginToken,
    });
    reloadMe(device.loginToken);
    setResponse(response);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {response && <T>{response}</T>}
      <TextInput
        value={name}
        onChangeText={setName}
        style={style(theme).textInput}
        placeholder="Name"
        placeholderTextColor={theme.secondaryTextSoft}
      />
      <Button
        onPress={postGangCreate}
        title={getText("gangCreateCTA")}
        theme={theme}
      />
    </ScrollView>
  );
};

export default GangCreate;
