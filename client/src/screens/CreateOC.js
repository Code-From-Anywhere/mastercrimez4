import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import { ActivityIndicator, TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import TabInput from "../components/TabInput";
import style from "../Style";
import { doOnce, get, getTextFunction, post } from "../Util";

const CreateOc = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    reloadMe,
    reloadOcs,
    device: { theme, loginToken },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [loading, setLoading] = useState(false);
  const [racecars, setRacecars] = useState(null);
  const [response, setResponse] = useState(null);
  const [numParticipants, setNumParticipants] = useState("4");
  const [type, setType] = useState("highway");
  const [car, setCar] = useState();

  const fetchRacecars = async () => {
    setLoading(true);
    const cars = await get(`racecars?token=${loginToken}`);
    setRacecars(cars);

    setLoading(false);
  };

  const submit = async () => {
    setLoading(true);
    const { success, response } = await post("createOc", {
      loginToken,
      numParticipants,
      type,
      carId: car?.id,
    });
    reloadMe(loginToken);
    setResponse(response);
    reloadOcs(loginToken);
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
        {loading && <ActivityIndicator />}
        {response && <T>{response}</T>}
        <T>{getText("amountParticipants")}</T>
        <TextInput
          style={style(theme).textInput}
          value={numParticipants}
          onChangeText={(x) => setNumParticipants(x)}
        />

        <T style={{ marginBottom: 10 }}>Type</T>
        <TabInput
          tabs={[
            {
              title: getText("ocBank"),
              onPress: () => setType("bank"),
              isActive: type === "bank",
            },
            {
              title: getText("ocCars"),
              onPress: () => setType("cars"),
              isActive: type === "cars",
            },
            {
              title: getText("ocShootout"),
              onPress: () => setType("shootout"),
              isActive: type === "shootout",
            },
          ]}
        />

        <T style={{ marginTop: 15, marginBottom: 10 }}>
          {getText("chooseYourCar")}:
        </T>
        <Button
          title={car ? car.auto : getText("chooseACar")}
          onPress={() => {
            // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
            const options = racecars.map((racecar) =>
              getText("createOcOption", racecar.auto, racecar.power)
            );
            options.push(getText("cancel"));
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

      <Button onPress={submit} title={getText("create")} />
    </View>
  );
};

export default CreateOc;
