import React from "react";
import Shop from "./Shop";

const ProtectionShop = ({ navigation, screenProps }) => {
  return (
    <Shop type="protection" navigation={navigation} screenProps={screenProps} />
  );
};

export default ProtectionShop;
