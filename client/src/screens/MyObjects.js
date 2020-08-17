import React from "react";
import { ScrollView, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import { doOnce } from "../Util";
const properties = [
  {
    name: "bulletFactory",
  },
  {
    name: "casino",
  },
  {
    name: "rld",
  },
  {
    name: "landlord",
  },
  {
    name: "junkies",
  },
  {
    name: "weaponShop",
  },
  {
    name: "airport",
  },
  {
    name: "estateAgent",
  },
  {
    name: "garage",
  },
  {
    name: "jail",
  },
  {
    name: "bank",
  },
];

const typeStrings = {
  bulletFactory: "Kogelfabriek",
  casino: "Casino",
  landlord: "Huisjesmelker",
  rld: "Red light district",
  junkies: "Leger des Heils",
  weaponShop: "Wapenwinkel",
  airport: "Vliegveld",
  estateAgent: "Makelaarskantoor",
  bank: "Bank",
  jail: "Gevangenis",
  garage: "Garage",
};

const MyObjects = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadCities,
    reloadMe,
    cities,
    device: { theme },
  },
}) => {
  doOnce(reloadCities);

  let amount = 0;
  properties
    .map((p) => p.name)
    .forEach((property) => {
      return cities?.forEach((city, index) => {
        const ownerKey = `${property}Owner`;
        if (city[ownerKey] === me?.name && me?.name) {
          amount += 1;
        }
      });
    });

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <T bold>
        Jij hebt {amount} {amount === 1 ? "bezitting" : "bezittingen"}!
      </T>

      {properties
        .map((p) => p.name)
        .map((property) => {
          return cities?.map((city, index) => {
            const ownerKey = `${property}Owner`;
            const propertyString = typeStrings[property];
            if (propertyString === undefined) console.log(property);
            if (city[ownerKey] === me?.name && me?.name) {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <T>{`${propertyString} in ${city.city}`}</T>
                  <Button
                    key={`index${index}${property}`}
                    style={{ marginVertical: 15 }}
                    theme={theme}
                    title={`Beheer`}
                    onPress={() =>
                      navigation.navigate("ManageObject", {
                        type: property,
                        city: city.city,
                      })
                    }
                  />
                </View>
              );
            }
          });
        })}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default MyObjects;
