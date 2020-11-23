import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { lighterHex } from "../Util";
import T from "./T";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
      // value previously stored
    } else {
      return undefined;
    }
  } catch (e) {
    // error reading value
    return undefined;
  }
};

const Content = ({ id, title, children, contentWidth }) => {
  const theme = useSelector((state) => state.device.theme);

  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const isExpanded = await getData(`@content=${id}`);
      if (isExpanded !== undefined) {
        console.log("set", id, " to ", isExpanded, typeof isExpanded);
        setExpanded(isExpanded === "true");
      }
      setLoading(false);
    })();
  }, []);

  return (
    <View
      style={{
        backgroundColor: lighterHex(theme.primary),
        margin: 20,
        padding: 20,
        borderRadius: 20,
        width: contentWidth + 20 * 4,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.linear();
          setExpanded(!expanded);
          storeData(`@content=${id}`, String(!expanded));
        }}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <T bold>{title}</T>
        <AntDesign
          name={expanded ? "caretup" : "caretdown"}
          color={theme.primaryText}
        />
      </TouchableOpacity>

      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          // setHeight(height);
          // setWidth(width);
        }}
      >
        {expanded && !loading && children}
      </View>
    </View>
  );
};

export default Content;
