import React from "react";
import { TouchableOpacity, Text, View, Dimensions } from "react-native";
import * as Icon from "react-native-vector-icons";
const { width } = Dimensions.get("window");
const isSmall = width < 800;

class Button extends React.Component {
  render() {
    const { icon, font, title, onPress, disabled, style } = this.props;

    const TheIcon = font && icon ? Icon[font] : View;

    return (
      <TouchableOpacity onPress={disabled ? undefined : onPress}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: disabled ? "#404040" : "#222",
            padding: 10,
            justifyContent: "center",
            paddingHorizontal: isSmall ? 5 : 20,
            borderRadius: 20,
            ...style,
          }}
        >
          {font && icon ? (
            <View style={{ marginRight: 20 }}>
              <TheIcon name={icon} color="white" size={20} />
            </View>
          ) : null}

          <Text style={{ textAlign: "center", color: "white" }}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Button;
