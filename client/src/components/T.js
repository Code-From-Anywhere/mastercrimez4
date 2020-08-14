import React from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";

const T = ({ children, bold, ...props }) => {
  const theme = useSelector((state) => state.device.theme);
  return (
    <Text
      {...props}
      style={[
        { color: theme.primaryText, fontWeight: bold ? "bold" : undefined },
        props.style,
      ]}
    >
      {children}
    </Text>
  );
};

export default T;
