import React from "react";
import Shop from "./Shop";

const WeaponShop = ({ navigation, screenProps }) => {
  return (
    <Shop type="weapon" navigation={navigation} screenProps={screenProps} />
  );
};

export default WeaponShop;
