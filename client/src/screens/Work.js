import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
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
  screenProps: {
    me,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

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

  const [selected, setSelected] = useState(0);
  const [response, setResponse] = useState(null);

  const submit = async () => {
    const { response } = await post("work", { work: selected });
    setResponse(response);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ margin: 20 }}>
        {options.map((option, index) => {
          return (
            <TouchableOpacity
              onPress={() => setSelected(index)}
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
                <Checkbox active={selected === index} />
                <T style={{ marginLeft: 10 }}>{option.title}</T>
              </View>
              <T>
                {option.hours} {getText("hours")}
              </T>
            </TouchableOpacity>
          );
        })}

        <Button theme={theme} title={getText("workCTA")} onPress={submit} />
      </View>
    </View>
  );
};

export default Work;
