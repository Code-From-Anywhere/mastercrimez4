import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import { TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import TabInput from "../components/TabInput";
import style from "../Style";
import { doOnce, get, post } from "../Util";

const CreateStreetrace = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    reloadMe,
    reloadStreetraces,
    device: { theme, loginToken },
  },
}) => {
  const [loading, setLoading] = useState(false);
  const [racecars, setRacecars] = useState(null);
  const [response, setResponse] = useState(null);
  const [numParticipants, setNumParticipants] = useState("4");
  const [type, setType] = useState("highway");
  const [price, setPrice] = useState("");
  const [car, setCar] = useState();

  const fetchRacecars = async () => {
    setLoading(true);
    const cars = await get(`racecars?token=${loginToken}`);
    setRacecars(cars);

    setLoading(false);
  };

  const submit = async () => {
    setLoading(true);
    const { success, response } = await post("createStreetrace", {
      loginToken,
      numParticipants,
      type,
      price,
      carId: car?.id,
    });
    reloadMe(loginToken);
    setResponse(response);
    reloadStreetraces();
    setLoading(false);
    if (success) {
      navigation.goBack(0);
    }
  };
  doOnce(fetchRacecars);
  const { showActionSheetWithOptions } = useActionSheet();

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <View>
        {response && <T>{response}</T>}
        <T>Aantal Deelnemers</T>
        <TextInput
          style={style(theme).textInput}
          value={numParticipants}
          onChangeText={(x) => setNumParticipants(x)}
        />

        <T style={{ marginBottom: 10 }}>Type</T>
        <TabInput
          tabs={[
            {
              title: "Snelweg",
              onPress: () => setType("highway"),
              isActive: type === "highway",
            },
            {
              title: "Stad",
              onPress: () => setType("city"),
              isActive: type === "city",
            },
            {
              title: "Bos",
              onPress: () => setType("forest"),
              isActive: type === "forest",
            },
          ]}
        />

        <T style={{ marginTop: 15 }}>Kosten per deelname</T>
        <TextInput
          style={style(theme).textInput}
          value={price}
          onChangeText={(x) => setPrice(x)}
        />

        <T style={{ marginTop: 15, marginBottom: 10 }}>Kies je auto:</T>
        <Button
          theme={theme}
          title={car ? car.auto : "Kies een auto"}
          onPress={() => {
            // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
            const options = racecars.map(
              (racecar) => `${racecar.auto} met ${racecar.power}.000 power`
            );
            options.push("Cancel");
            const destructiveButtonIndex = undefined;
            const cancelButtonIndex = options.length - 1;

            showActionSheetWithOptions(
              {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
              },
              (buttonIndex) => {
                setCar(racecars[buttonIndex]);
                // Do something here depending on the button index selected
              }
            );
          }}
        />
      </View>

      <Button theme={theme} onPress={submit} title="Maak aan" />
    </View>
  );
};

export default CreateStreetrace;
