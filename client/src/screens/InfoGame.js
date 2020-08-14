import React from "react";
// import MarkdownView from "react-native-markdown-renderer";
import { ScrollView, View } from "react-native";
import H1 from "../components/H1";
import T from "../components/T";
/**
 * A Privacy page
 */
const PrivacyPage = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
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

        <H1>Hoe krijg ik een bezitting?</H1>
        <T>
          Een bezitting kan je overnemen als hij geen eigenaar heeft. Klik dan
          op (Niemand) op het steden overzicht om de bezitting over te nemen.
          Wil je een bezitting overnemen die al een eigenaar heeft? Vermoord dan
          de eigenaar om de bezitting te kunnen pakken, want als je dood gaat
          raak je al je bezittingen kwijt!
        </T>

        <H1>Hoe wordt de winst bepaalt van de bezittingen?</H1>
        <T>
          - Een kogalfabriek eigenaar zal 50% van het geld van alle verkochte
          kogels krijgen
        </T>
        <T>
          - Huisjesmelkers, Leger des Heils en het Red Light District krijgen
          20% van iedereens inkomen bij het ophalen van inkomens.
        </T>
        <T>- Gevangenis krijgt uitkoopgeld</T>
        <T>
          - Zwitserse bank eigenaren krijgen 50% van de dagelijkse kosten van de
          zwitserse bank
        </T>
        <T>- Casino eigenaren krijgen 50% van de rake van de casino</T>
        <T>
          - Wapenwinkel, vliegveld, garage en makelaars krijgen 20% van de
          totale kosten gemaakt bij het kopen van nieuwe dingen in de
          respectievelijke winkel.
        </T>
      </View>
    </ScrollView>
  );
};
export default PrivacyPage;
