import React from "react";
import { Linking, Platform, Text, View } from "react-native";
import Button from "../components/Button";
import { post } from "../Util";
const Mollie = ({
  screenProps: {
    device,
    device: { theme },
  },
}) => {
  const submit = async (item) => {
    const response = await post("mollieCreate", {
      token: device.loginToken,
      item,
    });

    if (response.url) {
      Linking.openURL(response.url);
    }
  };
  return Platform.OS === "ios" ? (
    <Text style={{ color: theme.primaryText }}>
      Je kunt alleen op de website credits kopen!
    </Text>
  ) : (
    <View style={{ flex: 1, justifyContent: "space-around" }}>
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 1000 credits voor €10"
        onPress={() => submit(0)}
      />
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 6000 credits voor €50"
        onPress={() => submit(1)}
      />
      <Button
        theme={theme}
        style={{ marginHorizontal: 20 }}
        title="Koop 40000 credits voor €250"
        onPress={() => submit(2)}
      />

      <Text style={{ color: theme.primaryText }}>{`Betaal regels:\n\n
De website eigenaren zijn niet aansprakelijk voor eventuele schade/verlies opgelopen tijdens het spelen van dit spel.
Personen jonger dan 16 jaar dienen toestemming te vragen aan hun ouders voor het betalen.
Eventuele kosten die zijn opgelopen door het betalen zijn niet terug te krijgen van de eigenaren.
Het Betaald-Account-schap is alleen geldig op het account waarop het besteld is en het is niet mogelijk om dit over te plaatsen naar een ander account.
Mocht de website offline gaan of mocht er verlies van gegevens plaats vinden dan is het geld voor het Betaald-Account-Schap en het Betaald-Account-Schap zelf en alles wat je hebt gekregen door het Betaald-Account-Schap niet terug te krijgen!
`}</Text>
    </View>
  );
};

export default Mollie;
