import React from "react";
import { View } from "react-native";
import MarkdownView from "react-native-markdown-renderer";
import { getTextFunction } from "../Util";

/**
 * A Privacy page
 */
const Prizes = ({
  navigation,
  screenProps: {
    me,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ margin: 20 }}>
        <MarkdownView style={{ text: { color: theme.primaryText } }}>
          {getText("prizes")}
        </MarkdownView>
      </View>
    </View>
  );
};
export default Prizes;
