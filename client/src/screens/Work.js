import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import T from "../components/T";
import { post } from "../Util";
/*

Werken;

- Duurt tussen 1 en 6 uur
- Kan alleen als je push notificaties aan hebt staan
- Bij aanmaak word een event in de db aangemaakt in tabel workEvents. Deze word d.m.v. minute cronjobs verwijderd en word contanct geld uitgekeerd
- Je krijgt een push notificatie zodra het werk voltooid is.

*/

const options = [
  {
    title: "Ga vuilnis opruimen",
    hours: 1,
  },

  {
    title: "Ga de wc's schoonmaken op school",
    hours: 2,
  },

  {
    title: "Ga in het leger",
    hours: 3,
  },

  {
    title: "Ga gokken in een gok-café",
    hours: 4,
  },

  {
    title: "Ga werken bij de Mafia in Italië",
    hours: 5,
  },

  {
    title: "Ga politieagentje spelen",
    hours: 6,
  },

  {
    title: "Probeer president te worden",
    hours: 8,
  },
];
const Work = ({
  screenProps: {
    device: { theme },
  },
}) => {
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
              <T>{option.hours} uur</T>
            </TouchableOpacity>
          );
        })}

        <Button theme={theme} title="Ga werken" onPress={submit} />
      </View>
    </View>
  );
};

export default Work;
