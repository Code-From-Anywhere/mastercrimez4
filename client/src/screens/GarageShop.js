import React from "react";
import Shop from "./Shop";

const GarageShop = ({ navigation, screenProps }) => {
  return (
    <Shop type="garage" navigation={navigation} screenProps={screenProps} />
  );
};

export default GarageShop;
