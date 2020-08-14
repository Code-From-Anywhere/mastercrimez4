import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Button from "../components/Button";
import { doOnce, get } from "../Util";

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
  estateAgent: "Makelaar",
  bank: "Bank",
  jail: "Gevangenis",
  garage: "Garage",
};

const MyObjects = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const [cities, setCities] = useState(null);

  doOnce(async () => {
    fetchCities();
  });

  const fetchCities = async () => {
    const { cities } = await get("cities");
    setCities(cities);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {properties
        .map((p) => p.name)
        .map((property) => {
          return cities?.map((city, index) => {
            const ownerKey = `${property}Owner`;
            const propertyString = typeStrings[property];
            if (propertyString === undefined) console.log(property);
            if (city[ownerKey] === me?.name && me?.name) {
              return (
                <Button
                  style={{ marginVertical: 15 }}
                  theme={theme}
                  title={`Beheer je ${propertyString} in ${city.city}`}
                  onPress={() =>
                    navigation.navigate("ManageObject", {
                      type: property,
                      city: city.city,
                    })
                  }
                />
              );
            }
          });
        })}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default MyObjects;
