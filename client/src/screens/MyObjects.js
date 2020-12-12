import React from "react";
import { View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import { doOnce, getTextFunction, properties } from "../Util";

const MyObjects = ({
  navigation,
  screenProps: {
    me,
    reloadCities,
    cities,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

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
    <View style={{ flex: 1, padding: 15 }}>
      <T bold>
        {getText("youHave")} {amount}{" "}
        {amount === 1 ? getText("property") : getText("properties")}!
      </T>

      {properties
        .map((p) => p.name)
        .map((property) => {
          return cities?.map((city, index) => {
            const ownerKey = `${property}Owner`;
            const propertyString = getText(property);
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
                  {city.city === me?.city && (
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
                  )}
                </View>
              );
            }
          });
        })}

      <View style={{ height: 80 }} />
    </View>
  );
};

export default MyObjects;
