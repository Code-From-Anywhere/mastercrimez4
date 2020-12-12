import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import * as Icon from "react-native-vector-icons";
import { useSelector } from "react-redux";
const { width } = Dimensions.get("window");
const isSmall = width < 800;

const Button = ({ icon, font, title, onPress, disabled, style, textStyle }) => {
  const TheIcon = font && icon ? Icon[font] : View;
  const theme = useSelector((state) => state.device.theme);

  return (
    <TouchableOpacity onPress={disabled ? undefined : onPress}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: disabled ? `${theme.secondary}55` : theme.secondary,
          padding: 10,
          justifyContent: "center",
          paddingHorizontal: isSmall ? 5 : 20,
          // borderRadius: 20,
          ...style,
        }}
      >
        {font && icon ? (
          <View style={{ marginRight: 20 }}>
            <TheIcon name={icon} color={theme.secondaryText} size={20} />
          </View>
        ) : null}

        {title && (
          <Text
            style={[
              { textAlign: "center", color: theme.secondaryText },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
