import React from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";
const H1 = ({ children }) => {
  const theme = useSelector((state) => state.device.theme);

  return (
    <Text
      style={{ fontSize: 30, fontWeight: "bold", color: theme.primaryText }}
    >
      {children}
    </Text>
  );
};

export default H1;
