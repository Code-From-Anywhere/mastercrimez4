import React from "react";
import { View } from "react-native";
import T from "../components/T";
import { doOnce } from "../Util";
const Code = ({ screenProps: { me, device, dispatch } }) => {
  //  When opening the site on web  on /Case or /Code or /StealCar on an unverified account, open modal
  doOnce(() => {
    if (!me?.phoneVerified) {
      dispatch({ type: "SET_LOGGED", value: false });
    }
  });

  return (
    <View>
      <T>HEY GEK</T>
    </View>
  );
};

export default Code;
