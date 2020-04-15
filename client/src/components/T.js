import React from "react";
import { Text } from "react-native";

const T = ({ children, ...props }) => (
  <Text {...props} style={[{ color: "white" }, props.style]}>
    {children}
  </Text>
);

export default T;
