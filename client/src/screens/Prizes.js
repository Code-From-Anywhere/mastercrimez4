import React from "react";
// import MarkdownView from "react-native-markdown-renderer";
import { View, Text, Linking } from "react-native";
import T from "../components/T";

const H1 = ({ children }) => (
  <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
    {children}
  </Text>
);
/**
 * A Privacy page
 */
const Prizes = ({ navigation }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ margin: 20 }}>
        <H1>Prijzen</H1>

        <T>{`
Aan het eind van de prijzenronde winnen de spelers met de meeste gamepoints.
Het eind van deze ronde is zondag 31 mei 2020.

#1: 100 euro
#2: 60 euro
#3: 40 euro`}</T>
      </View>
    </View>
  );
};
export default Prizes;
