import React from "react";
import { Text, View } from "react-native";
const MollieComplete = ({
  screenProps: {
    device: { theme },
  },
}) => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: theme.primaryText }}>Bedankt voor je betaling</Text>
    </View>
  );
};

export default MollieComplete;
