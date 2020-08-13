import React from "react";
// import MarkdownView from "react-native-markdown-renderer";
import { Text, View } from "react-native";
import T from "../components/T";

const H1 = ({ children }) => (
  <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
    {children}
  </Text>
);
/**
 * A Privacy page
 */
const PrivacyPage = ({ navigation }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ margin: 20 }}>
        <H1>Hoe werkt vermoorden?</H1>
        <T>
          Om iemand te killen moet je zijn leven naar 0% brengen. Dit kan jou
          tussen de 1 en 500.000 kogels kosten Hoe dit wordt berekend, is
          geheim, maar het ligt aan deze factoren: Voor de aanvaller: Het wapen,
          de moordervaring en de rang. Hoe beter elk van dezen, hoe minder
          kogels je nodig zult hebben. Voor de verdediger: De verdediging, de
          moordervaring en de rang. Hoe beter elk van dezen, hoe meer kogels de
          aanvaller nodig zal hebben. De rang heeft de meeste invloed, daarna
          het wapen, de verdiging en de moordervaring.
        </T>
      </View>
    </View>
  );
};
export default PrivacyPage;
