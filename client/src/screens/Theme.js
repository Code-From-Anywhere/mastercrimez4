import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getTextFunction } from "../Util";

export const DEFAULT_THEME = {
  name: "Original",
  secondary: "#222222",
  secondaryText: "#FFFFFF",
  secondaryTextSoft: "#CCCCCC",
  primary: "#555555",
  primaryText: "#FFFFFF",
  separatorColor: "#CCCCCC",
};

export type Theme = {
  name: String,
  primary: String,
  primaryText: String,
  secondary: String,
  secondaryText: String,
};

const ThemeScreen = ({ navigation, screenProps: { dispatch, me, device } }) => {
  const currentTheme = device.theme;
  const setTheme = (theme) => {
    dispatch({ type: "SET_THEME", value: theme });
  };

  const getText = getTextFunction(me?.locale);

  const themes = [
    DEFAULT_THEME,

    {
      name: getText("themeLightBrown"),
      secondary: "#f5e6b4",
      secondaryText: "#000000",
      secondaryTextSoft: "#404040",
      primary: "#555555",
      primaryText: "#FFFFFF",
      separatorColor: "#CCCCCC",
    },
    {
      name: getText("themeWhite"),
      primary: "#FFFFFF",
      secondary: "#CCCCCC",
      primaryText: "#000000",
      secondaryText: "#000000",
      secondaryTextSoft: "#404040",
      separatorColor: "#CCCCCC",
    },
    {
      name: getText("themeBlue"),
      primary: "#FFFFFF",
      secondary: "#add8e6",
      primaryText: "#000000",
      secondaryText: "#000000",
      secondaryTextSoft: "#404040",
      separatorColor: "#CCCCCC",
    },
    {
      name: getText("themeBlack"),
      primary: "#000000",
      secondary: "#222222",
      primaryText: "#FFFFFF",
      secondaryText: "#FFFFFF",
      secondaryTextSoft: "#CCCCCC",
      separatorColor: "#FFFFFF",
    },
  ];

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
