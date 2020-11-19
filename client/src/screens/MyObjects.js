import React from "react";
import { ScrollView, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import { doOnce, getTextFunction } from "../Util";
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
  const getText = getTextFunction(me?.locale);

  const typeStrings = {
    bulletFactory: getText("bulletFactory"),
    casino: getText("casino"),
    landlord: getText("landlord"),
    junkies: getText("junkiesObject"),
    weaponShop: getText("weaponShop"),
    rld: getText("rld"),
    airport: getText("airport"),
    estateAgent: getText("estateAgent"),
    bank: getText("bankObject"),
    jail: getText("jail"),
    garage: getText("garage"),
  };

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
        {getText("youHave")} {amount}{" "}
        {amount === 1 ? getText("property") : getText("properties")}!
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
                    title={getText("manage")}
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
