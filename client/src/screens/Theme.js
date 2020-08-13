import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export const DEFAULT_THEME = {
  name: "Licht bruin",
  secondary: "#f5e6b4",
  secondaryText: "#000",
  primary: "#555",
  primaryText: "#FFF",
};

export type Theme = {
  name: String,
  primary: String,
  primaryText: String,
  secondary: String,
  secondaryText: String,
};

const themes = [
  DEFAULT_THEME,
  {
    name: "Origineel",
    secondary: "#222",
    secondaryText: "#FFF",
    primary: "#555",
    primaryText: "#FFF",
  },
  {
    name: "Wit",
    primary: "#FFF",
    secondary: "#CCC",
    primaryText: "#000",
    secondaryText: "#000",
  },
  {
    name: "Blauw",
    primary: "#FFF",
    secondary: "lightblue",
    primaryText: "#000",
    secondaryText: "#000",
  },
  {
    name: "Zwart",
    primary: "#000",
    secondary: "#222",
    primaryText: "#FFF",
    secondaryText: "#FFF",
  },
];
const ThemeScreen = ({ navigation, screenProps: { dispatch, me, device } }) => {
  const currentTheme = device.theme;
  const setTheme = (theme) => {
    dispatch({ type: "SET_THEME", value: theme });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {themes.map((theme, index) => {
        return (
          <TouchableOpacity
            onPress={() => setTheme(theme)}
            key={`i${index}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              margin: 20,
            }}
          >
            <View>
              <View
                style={{
                  backgroundColor: theme.primary,
                  borderTopLeftRadius: 20,
                  borderWidth: 1,
                  borderTopRightRadius: 20,
                  width: 40,
                  height: 20,
                }}
              />
              <View
                style={{
                  backgroundColor: theme.secondary,
                  borderWidth: 1,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  width: 40,
                  height: 20,
                }}
              />
            </View>

            <Text style={{ color: currentTheme.primaryText, marginLeft: 20 }}>
              {theme.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default ThemeScreen;
