import { StyleSheet } from "react-native";

const style = (theme) =>
  StyleSheet.create({
    textInput: {
      color: theme.secondaryText,
      backgroundColor: theme.secondary,
      padding: 10,
      justifyContent: "center",
      paddingHorizontal: 20,
      // borderRadius: 20,
      marginVertical: 10,
    },
    container: {
      flex: 1,
      margin: 20,
    },
  });

export default style;
