import React from "react";
import { Text, View } from "react-native";
import { getTextFunction } from "../Util";

const MollieComplete = ({
  screenProps: {
    me,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: theme.primaryText }}>
        {getText("thanksForPayment")}
      </Text>
    </View>
  );
};

export default MollieComplete;
