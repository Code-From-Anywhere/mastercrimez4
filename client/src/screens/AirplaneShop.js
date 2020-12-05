import React from "react";
import Shop from "./Shop";

const AirplaneShop = ({ navigation, screenProps }) => {
  return (
    <Shop type="airplane" navigation={navigation} screenProps={screenProps} />
  );
};

export default AirplaneShop;
