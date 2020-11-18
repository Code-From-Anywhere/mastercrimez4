import { Entypo } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
const Checkbox = ({ active }) => {
  return (
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {active && <Entypo name="check" size={24} />}
    </View>
  );
};

export default Checkbox;
