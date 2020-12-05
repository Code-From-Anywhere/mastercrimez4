import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import Checkbox from "../components/Checkbox";
import T from "../components/T";
import { getTextFunction, post } from "../Util";
/*

Werken;

- Duurt tussen 1 en 6 uur
- Kan alleen als je push notificaties aan hebt staan
- Bij aanmaak word een event in de db aangemaakt in tabel workEvents. Deze word d.m.v. minute cronjobs verwijderd en word contanct geld uitgekeerd
- Je krijgt een push notificatie zodra het werk voltooid is.

*/

const Work = ({
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

  const options = [
    {
      title: getText("workOption1"),
      hours: 1,
    },

    {
      title: getText("workOption2"),
      hours: 2,
    },

    {
      title: getText("workOption3"),
      hours: 3,
    },

    {
      title: getText("workOption4"),
      hours: 4,
    },

    {
      title: getText("workOption5"),
      hours: 5,
    },

    {
      title: getText("workOption6"),
      hours: 6,
    },

    {
      title: getText("workOption7"),
      hours: 8,
    },
  ];

  const [selected, setSelected] = useState(1);
  const [response, setResponse] = useState(null);

  const submit = async () => {
    const { response } = await post("work", {
      token: device.loginToken,
      captcha,
      option: selected,
    });
    setResponse(response);
  };

  const minute = Math.round((me?.workEndsAt - Date.now()) / (60 * 1000));

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ margin: 20 }}>
        {response ? (
          <T>{response}</T>
        ) : me?.workEndsAt > Date.now() ? (
          <T>{getText("workWait", minute)}</T>
        ) : (
          <View>
            {options.map((option, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelected(index + 1)}
                  key={`key${index}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox active={selected === index + 1} />
                    <T style={{ marginLeft: 10 }}>{option.title}</T>
                  </View>
                  <T>
                    {option.hours} {getText("hours")}
                  </T>
                </TouchableOpacity>
              );
            })}

            <Captcha
              screenProps={screenProps}
              captcha={captcha}
              onChangeCaptcha={setCaptcha}
              random={random}
              onChangeRandom={setRandom}
            />

            <Button theme={theme} title={getText("workCTA")} onPress={submit} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Work;
