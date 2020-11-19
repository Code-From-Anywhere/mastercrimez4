import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { getTextFunction, post } from "../Util";

const ChangeName = ({
  navigation,
  screenProps: {
    device,
    reloadMe,
    me,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [name, setName] = useState(me?.name);
  const [response, setResponse] = useState(null);

  const changeName = async () => {
    const { response } = await post("updateName", {
      loginToken: device.loginToken,
      name,
    });
    reloadMe(device.loginToken);
    setResponse(response);
  };

  return (
    <ScrollView>
      <View style={{ margin: 20 }}>
        {response ? <T>{response}</T> : null}

        <View
          style={{
            marginVertical: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{ ...style(theme).textInput, flex: 1 }}
            placeholderTextColor={theme.secondaryTextSoft}
            placeholder={getText("name")}
            value={name}
            onChangeText={(x) => setName(x)}
          />
          <Button
            onPress={changeName}
            theme={theme}
            title={getText("change")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ChangeName;
