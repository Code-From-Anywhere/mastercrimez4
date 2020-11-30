import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { doOnce, get, getTextFunction, post } from "../Util";

export const RobberyTypes = [
  {
    type: "snackbar",
    cost: 10000,
    profit: 50000,
    difficulty: 1,
    seconds: 60,
    image: require("../../assets/robbery/snackbar.jpg"),
  },
  {
    type: "clothesstore",
    cost: 20000,
    profit: 75000,
    difficulty: 5,
    seconds: 180,
    image: require("../../assets/robbery/clothesstore.jpg"),
  },
  {
    type: "supermarket",
    cost: 50000,
    profit: 100000,
    difficulty: 10,
    seconds: 240,
    image: require("../../assets/robbery/supermarket.jpg"),
  },
  {
    type: "drugstore",
    cost: 100000,
    profit: 250000,
    difficulty: 20,
    seconds: 300,
    image: require("../../assets/robbery/drugstore.jpg"),
  },
  {
    type: "coffeeshop",
    cost: 150000,
    profit: 300000,
    difficulty: 50,
    seconds: 300,
    image: require("../../assets/robbery/coffeeshop.jpg"),
  },
  {
    type: "cardealer",
    cost: 200000,
    profit: 400000,
    difficulty: 100,
    seconds: 600,
    image: require("../../assets/robbery/cardealer.jpg"),
  },
  {
    type: "bank",
    cost: 250000,
    profit: 500000,
    difficulty: 200,
    seconds: 900,
    image: require("../../assets/robbery/bank.jpg"),
  },
  {
    type: "casino",
    cost: 500000,
    profit: 1000000,
    difficulty: 300,
    seconds: 1800,
    image: require("../../assets/robbery/casino.jpg"),
  },
  {
    type: "jewelrystore",
    cost: 1000000,
    profit: 2000000,
    difficulty: 500,
    seconds: 3600,
    image: require("../../assets/robbery/jewelrystore.jpg"),
  },
];

const Robbery = ({ robbery, isActive, onPress, title }) => {
  return (
    <TouchableOpacity
      style={{
        opacity: isActive ? 1 : 0.4,
        marginHorizontal: 20,
      }}
      onPress={onPress}
    >
      <Image
        source={robbery.image}
        style={{ width: 100, height: 100 }}
        resizeMode="cover"
      />
      <T bold>{title}</T>
    </TouchableOpacity>
  );
};
const CreateRobbery = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    reloadMe,
    reloadRobberies,
    device: { theme, loginToken },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [loading, setLoading] = useState(false);
  const [racecars, setRacecars] = useState(null);
  const [response, setResponse] = useState(null);
  const [numParticipants, setNumParticipants] = useState("4");
  const [type, setType] = useState("highway");
  const [price, setPrice] = useState("");
  const [prize, setPrize] = useState("0");
  const [car, setCar] = useState();

  const fetchRacecars = async () => {
    setLoading(true);
    const cars = await get(`racecars?token=${loginToken}`);
    setRacecars(cars);

    setLoading(false);
  };

  const submit = async () => {
    setLoading(true);
    const { success, response } = await post("createRobbery", {
      loginToken,
      numParticipants,
      type,
      price,
      prize,
      carId: car?.id,
    });
    reloadMe(loginToken);
    setResponse(response);
    reloadRobberies();
    setLoading(false);
    if (success) {
      navigation.goBack(0);
    }
  };
  doOnce(fetchRacecars);
  const { showActionSheetWithOptions } = useActionSheet();

  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        {response && <T>{response}</T>}
        <T>{getText("amountParticipants")}</T>
        <TextInput
          style={style(theme).textInput}
          value={numParticipants}
          onChangeText={(x) => setNumParticipants(x)}
        />

        <T style={{ marginBottom: 10 }}>Type</T>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {RobberyTypes.map((t) => {
            return (
              <Robbery
                robbery={t}
                title={getText(t.type)}
                onPress={() => setType(t.type)}
                isActive={type === t.type}
              />
            );
          })}
        </View>
      </View>

      <Button onPress={submit} title={getText("create")} />
    </ScrollView>
  );
};

export default CreateRobbery;
