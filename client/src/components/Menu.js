import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Icon from "react-native-vector-icons";

const Menu = ({ navigation, title, to, onPress, IconFont, icon, theme }) => {
  const TheIcon = IconFont && icon ? Icon[IconFont] : null;
  return (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : navigation.navigate(to))}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          paddingHorizontal: 20,
          borderBottomWidth: 0.5,
          borderBottomColor: "black",
          paddingVertical: 15,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 40 }}>
            {TheIcon && (
              <TheIcon name={icon} size={24} color={theme.primaryText} />
            )}
          </View>
          <Text style={{ color: theme.primaryText }}>{title}</Text>
        </View>
        <Icon.MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={theme.primaryText}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Menu;
