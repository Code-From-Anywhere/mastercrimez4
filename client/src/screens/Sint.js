import React, { useState } from "react";
import { View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import { getTextFunction, post } from "../Util";

const Sint = ({
  screenProps,
  screenProps: {
    me,
    device,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  const [captcha, setCaptcha] = useState("");
  const [random, setRandom] = useState(Math.random());
  const [response, setResponse] = useState(null);

  const submit = async () => {
    const { response } = await post("sint", {
      token: device.loginToken,
      captcha,
    });
    setResponse(response);
  };

  const minute = Math.round((me?.sintEndsAt - Date.now()) / (60 * 1000));

  return (
    <View style={{ flex: 1 }}>
      <View style={{ margin: 20 }}>
        {response ? (
          <T>{response}</T>
        ) : me?.sintEndsAt > Date.now() ? (
          <T>{getText("sintWait", minute)}</T>
        ) : (
          <View>
            <Captcha
              screenProps={screenProps}
              captcha={captcha}
              onChangeCaptcha={setCaptcha}
              random={random}
              onChangeRandom={setRandom}
            />

            <Button theme={theme} title={getText("sintCTA")} onPress={submit} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Sint;
