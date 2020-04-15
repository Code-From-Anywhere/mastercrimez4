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
const PrivacyPage = ({ navigation }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ margin: 20 }}>
        <H1>Verboden spelgedrag</H1>
        <T>
          {`IN HET SPEL WORD EEN CRIMINELE WERELD NAGEBOOTST. DE BEDOELING IS DAT DE SPELERS VAN HET SPEL HET SPEL PLEZIERIG EN AVONTUURLIJK ERVAREN. HET IS NIET DE BEDOELING DAT BINNEN HET SPEL ETHISCH ONVERANTWOORD GEDRAG PLAATSVINDT. MEER SPECIFIEK BETEKEND DIT:
\n\n
1: Heb respect voor de (hulp)admins en mede gamers
2: Het is verboden:
- te schelden en/of grof taal te gebruiken\n
- pornografische plaatjes/muziek/teksten te plaatsen\n
- racistische en/of discriminerende plaatjes/muziek/teksten te plaatsen\n
- dreigende berichten te sturen die door mede Gamers als dreigend buiten het spel om kunnen worden ervaren.\n
- de crew te beledigen, uit te schelden of te bedreigen, hiervoor worden nog veel hogere straffen gegeven dan normaal!\n
\n\n

Algemene regels:\n
1: Bugs/Fouten dienen altijd te worden gemeld in het forum (bugs forum)\n
2: Je hebt geen enkele rechten op je account\n
3: Admins mogen je account aanpassen zonder reden\n
4: De makers van het spel garanderen niet dat er geen fouten in het spel zitten\n
5: Als je een maand niet meer online bent geweest word je account gedeleted!\n
6: Als je door een verandering in het spel ineens heel veel kwijt bent kan dit niet worden terug gegeven.\n
7: Het is verboden:\n
- te zeuren om admin/hulpadmin te worden\n
- iets te kopi�ren van deze site\n
- rare/grove usernames te gebruiken\n
- reclame te maken voor andere websites\n
- berichten massaal rond te sturen\n
- te hacken en/of deze website te saboteren\n
- meerdere dezelfde berichtjes in het forum en/of gastenboek te plaatsen (berichten herhalen)\n
- irritante berichten in het gastenboek te plaatsen.\n
\n\n

Bel regels:\n\n
De website eigenaren zijn niet aansprakelijk voor eventuele schade/verlies opgelopen tijdens het spelen van dit spel.
Personen jonger dan 16 jaar dienen toestemming te vragen aan hun ouders voor het bellen.
Eventuele kosten die zijn opgelopen door het bellen zijn niet terug te krijgen van de eigenaren.
Het Betaald-Account-schap is alleen geldig op het account waarop het besteld is en het is niet mogelijk om dit over te plaatsen naar een ander account.
Mocht de website offline gaan of mocht er verlies van gegevens plaats vinden dan is het geld voor het Betaald-Account-Schap en het Betaald-Account-Schap zelf �n alles wat je hebt gekregen d��r het Betaald-Account-Schap niet terug te krijgen!
\n\n\n


Bij overtreding van een van deze regels zal de Admin bepalen of je een waarschuwing krijgt of meteen wordt verbannen! Een IP-ban wordt er nooit meer afgehaald. IP-bans worden niet terug gedraaid en ook geen uitleg over gegeven.
\n\n\n


Regels/Bans voor MasterCrimeZ: BANTIJDEN,
\n\n
- Homo en andere scheldwoorden 24 uur ban. \n
- Kanker 3 maanden. (Ook kk, kenker)\n
- Discriminatie 1 maand. \n
- Dreigen in real 1 maand. \n
- Reclame andere site 1 jaar ban. \n
- Bug misbruik : tijdelijke ban + account reset\n
- hacken : 1 jaar ban (indien genoeg bewijs)\n
- Berichtenbalk schelden: 2 uur of meer\n
- Streetrace-Evenementen doen met subaccounts: 1 maand\n`}
        </T>
      </View>
    </View>
  );
};
export default PrivacyPage;
