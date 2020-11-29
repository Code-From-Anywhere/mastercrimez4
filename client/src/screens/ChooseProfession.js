import React, { useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import { getTextFunction, post } from "../Util";

const { width } = Dimensions.get("window");
const SIZE = 300;
const MARGIN = 10;
const Gangs = ({
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
  const [loading, setLoading] = useState(false);

  const postChooseProfession = async (profession) => {
    setLoading(true);

    const { response } = await post(`chooseProfession`, {
      token: device.loginToken,
      profession,
    });
    setLoading(false);
    setResponse(response);
  };

  const PROFESSIONS = [
    { type: "thief", image: require("../../assets/profession/thief.jpg") },
    {
      type: "carthief",
      image: require("../../assets/profession/carthief.jpg"),
    },
    {
      type: "weedgrower",
      image: require("../../assets/profession/weedgrower.jpg"),
    },
    { type: "killer", image: require("../../assets/profession/killer.jpg") },
    { type: "pimp", image: require("../../assets/profession/pimp.jpg") },
    { type: "banker", image: require("../../assets/profession/banker.jpg") },
    {
      type: "jailbreaker",
      image: require("../../assets/profession/jailbreaker.jpg"),
    },
  ];

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {response ? (
        <T>{response}</T>
      ) : me?.canChooseProfession ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {PROFESSIONS.map((profession) => {
            return (
              <View style={{ width: 100, margin: 20 }}>
                <Image
                  source={profession.image}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
                <View style={{ height: 100 }}>
                  <T bold>{getText(profession.type)}</T>
                  <T>{getText(profession.type + "Advantage")}</T>
                </View>
                <Button
                  title={getText("choose")}
                  onPress={() => postChooseProfession(profession.type)}
                />
              </View>
            );
          })}
        </View>
      ) : (
        <T>{getText("youAreProfession", getText(me?.profession))}</T>
      )}
    </ScrollView>
  );
};

export default Gangs;
