import React, { Component } from "react";
import { Text, View, Linking } from "react-native";
import Button from "../components/Button";
import style from "../Style";

class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    return (
      <View style={style.container}>
        <Text style={{ color: "white" }}>
          MasterCrimeZ is open source. Dit betekent dat je kan helpen om meer
          functionaliteit te creëren of een andere versie van MasterCrimeZ
          online kan zetten. MasterCrimeZ is geschreven in React Native en Node
          JS. Wil je helpen? Neem contact op met WebMaster voor meer info.
        </Text>

        <Button
          title="Klik hier voor de code"
          onPress={() => {
            Linking.openURL(
              "https://github.com/EAT-CODE-KITE-REPEAT/mastercrimez4"
            );
          }}
        />
      </View>
    );
  }
}

export default Status;
