import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import T from "../components/T";
import { doOnce, getTextFunction, numberFormat } from "../Util";

const properties = [
  { name: "bulletFactory" },
  { name: "casino" },
  { name: "rld" },
  { name: "landlord" },
  { name: "junkies" },
  { name: "weaponShop" },
  { name: "airport" },
  { name: "estateAgent" },
  { name: "garage" },
  { name: "jail" },
  { name: "bank" },
  { name: "gym" },
  { name: "hospital" },
  { name: "market" },
  { name: "stockExchange" },
];

const Properties = ({
  navigation,
  screenProps: {
    device,
    me,
    cities,
    reloadCities,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  doOnce(reloadCities);

  const gridStyle = {
    paddingVertical: 10,
    paddingLeft: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "black",
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <View style={{ flexDirection: "row" }}>
        <View>
          <View style={gridStyle}>
            <T bold>{getText("city")}</T>
          </View>
          {cities?.map((city, index) => {
            return (
              <View
                key={`i${index}`}
                style={[
                  gridStyle,
                  {
                    borderRightColor: "black",
                    borderRightWidth: 0.5,
                    borderLeftColor: "black",
                    borderLeftWidth: 0.5,
                    paddingLeft: 10,
                  },
                ]}
              >
                <T>{city.city}</T>
              </View>
            );
          })}
        </View>

        <ScrollView horizontal>
          <View>
            <Grid style={gridStyle}>
              {properties.map((property) => {
                return ["owner", "damage", "profit"].map((suffix) => {
                  const field = `${getText(property.name)} ${getText(suffix)}`;

                  return (
                    <Col style={{ width: 150 }}>
                      <T bold numberOfLines={1}>
                        {field}
                      </T>
                    </Col>
                  );
                });
              })}
            </Grid>

            {cities?.map((city, index) => {
              return (
                <Grid style={gridStyle}>
                  {properties.map((property) => {
                    return ["Owner", "Damage", "Profit"].map((fieldSuffix) => {
                      const field = `${property.name}${fieldSuffix}`;

                      const formattedField =
                        fieldSuffix === "Owner" ? (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("Profile", {
                                name: city[field],
                              })
                            }
                          >
                            <T>{city[field]}</T>
                          </TouchableOpacity>
                        ) : fieldSuffix === "Damage" ? (
                          <T>{city[field]}%</T>
                        ) : (
                          <T>€{numberFormat(city[field])},-</T>
                        );
                      return <Col style={{ width: 150 }}>{formattedField}</Col>;
                    });
                  })}
                </Grid>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Properties;
