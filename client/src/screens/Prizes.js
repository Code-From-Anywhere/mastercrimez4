import React from "react";
// import MarkdownView from "react-native-markdown-renderer";
import { View } from "react-native";
import H1 from "../components/H1";
import T from "../components/T";

/**
 * A Privacy page
 */
const Prizes = ({ navigation }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ margin: 20 }}>
        <H1>Prijzen</H1>

        <T>Er zijn momenteel geen prijzen</T>
        {/* <T>{`
Aan het eind van de prijzenronde winnen de spelers met de meeste gamepoints.
Het eind van deze ronde is zondag 31 mei 2020.

#1: 100 euro
#2: 60 euro
#3: 40 euro`}</T> */}
      </View>
    </View>
  );
};
export default Prizes;
