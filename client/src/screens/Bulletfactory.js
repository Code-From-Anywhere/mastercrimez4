import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import style from "../Style";
import { doOnce, get, post } from "../Util";

const Bulletfactory = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const [response, setResponse] = useState(null);
  const [bullets, setBullets] = useState(null);

  const [cities, setCities] = useState(null);

  doOnce(async () => {
    fetchCities();
  });

  const fetchCities = async () => {
    const { cities } = await get("cities");
    setCities(cities);
  };

  const city = cities?.find((x) => x.city === me?.city);

  const submit = async () => {
    const { response } = await post("buyBullets", {
      loginToken: device.loginToken,
      amount: bullets,
    });
    reloadMe(device.loginToken);
    setResponse(response);
    fetchCities();
  };

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text style={{ color: theme.primaryText }}>
        De eigenaar van de kogelfabriek in{" "}
        <Text style={{ fontWeight: "bold" }}>{me?.city}</Text> is{" "}
        <Text style={{ fontWeight: "bold" }}>
          {city?.bulletFactoryOwner || "(Niemand)"}
        </Text>
        , de prijs per kogel is {city?.bulletPrice}, en de winst is{" "}
        {city?.bulletFactoryProfit}
      </Text>

      <Text style={{ color: theme.primaryText, marginTop: 20 }}>
        Er zijn nog <Text style={{ fontWeight: "bold" }}>{city?.bullets}</Text>{" "}
        kogels beschikbaar
      </Text>

      {response && (
        <Text style={{ color: theme.primaryText, marginVertical: 20 }}>
          {response}
        </Text>
      )}

      <TextInput
        placeholder="0"
        value={bullets}
        onChangeText={(x) => setBullets(x)}
        style={style(theme).textInput}
      />

      <Button theme={theme} title="Koop" onPress={submit} />
    </View>
  );
};

export default Bulletfactory;
