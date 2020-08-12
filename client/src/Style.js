import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

const style = StyleSheet.create({
  textInput: {
    color: "white",
    backgroundColor: Colors.primary,
    padding: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    margin: 20,
  },
});

export default style;
