import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import T from "../components/T";
import { doOnce, getTextFunction, numberFormat, properties } from "../Util";

const Properties = ({
  navigation,
  screenProps: { me, cities, reloadCities },
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
          <View style={{ width: properties.length * 3 * 150 }}>
            <Grid style={gridStyle}>
              {properties.map((property, index) => {
                return ["owner", "damage", "profit", "price", "bullets"].map(
                  (suffix) => {
                    if (
                      (suffix === "price" || suffix === "bullets") &&
                      property.name !== "bulletFactory"
                    ) {
                      return;
                    }
                    const field = `${getText(property.name)} ${getText(
                      suffix
                    )}`;

                    return (
                      <Col size={1} key={`prop${index}${suffix}`}>
                        <T bold numberOfLines={1}>
                          {field}
                        </T>
                      </Col>
                    );
                  }
                );
              })}
            </Grid>

            {cities?.map((city, index) => {
              return (
                <Grid style={gridStyle}>
                  {properties.map((property) => {
                    return [
                      "Owner",
                      "Damage",
                      "Profit",
                      "Price",
                      "bullets",
                    ].map((fieldSuffix) => {
                      if (
                        (fieldSuffix === "Price" ||
                          fieldSuffix === "bullets") &&
                        property.name !== "bulletFactory"
                      ) {
                        return;
                      }
                      const field =
                        fieldSuffix === "bullets"
                          ? fieldSuffix
                          : `${property.name}${fieldSuffix}`;

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
                        ) : fieldSuffix === "Profit" ||
                          fieldSuffix === "Price" ? (
                          <T>€{numberFormat(city[field])},-</T>
                        ) : (
                          <T>{numberFormat(city[field])}</T>
                        );
                      return <Col>{formattedField}</Col>;
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
