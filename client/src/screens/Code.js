import React, { useState } from "react";
import { View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import { doOnce, getTextFunction, post } from "../Util";
const Code = ({
  navigation: {
    state: { params },
  },
  screenProps: { me, device, dispatch },
}) => {
  const [response, setResponse] = useState(null);

  const code = params?.param;
  //  When opening the site on web  on /Case or /Code or /StealCar on an unverified account, open modal
  doOnce(() => {
    if (!me?.phoneVerified) {
      dispatch({ type: "SET_LOGGED", value: false });
    }
  });

  const getText = getTextFunction(me?.locale);

  return (
    <View>
      {response ? (
        <T>{response}</T>
      ) : (
        <Button
          title={getText("openSuitcaseButton")}
          onPress={async () => {
            const { response } = await post("enterCode", {
              loginToken: device.loginToken,
              code,
            });
            setResponse(response);
          }}
        />
      )}
    </View>
  );
};

export default Code;
