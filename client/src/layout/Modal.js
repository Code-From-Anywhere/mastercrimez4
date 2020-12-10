import * as Icon from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, Platform, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const Modal = ({ view, navigation, setView, children, headerHeight }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(null);
  useEffect(() => {
    let keyboardWillShowListener;
    let keyboardWillHideListener;
    let keyboardDidShowListener;
    let keyboardDidHideListener;
    if (Platform.OS === "ios") {
      keyboardWillShowListener = Keyboard.addListener(
        "keyboardWillShow",
        keyboardWillShow
      );
      keyboardWillHideListener = Keyboard.addListener(
        "keyboardWillHide",
        keyboardWillHide
      );
    } else {
      keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        keyboardWillShow
      );
      keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        keyboardWillHide
      );
    }

    return () => {
      if (Platform.OS === "ios") {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      } else {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      }
    };
  });

  const keyboardWillShow = (e) => {
    const toValue = e.endCoordinates.height;
    setKeyboardHeight(toValue);
  };

  const keyboardWillHide = (e) => {
    setKeyboardHeight(null);
  };

  const keydown = useCallback((event) => {
    if (event.keyCode === 27) {
      //esc
      //Do whatever when esc is pressed
      close();
    }
  }, []);

  const close = () => {
    if (view !== "game" && view !== "territories" && view !== "crimes") {
      setView("game");
    }

    navigation.popToTop();
  };
  useEffect(() => {
    if (Platform.OS === "web") {
      document.addEventListener("keydown", keydown, false);

      return () => {
        document.removeEventListener("keydown", keydown, false);
      };
    }
  }, []);

  const theme = useSelector((state) => state.device.theme);

  const defaultBottom = view === "chat" || view === "crimes" ? 70 : 140;
  return (
    <View
      style={{
        position: "absolute",
        top: headerHeight + 20,
        bottom: keyboardHeight ? keyboardHeight : defaultBottom,
        left: 5,
        right: 5,
        backgroundColor: `${theme.primary}CC`,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {navigation.state.history.length > 1 ? (
          <TouchableOpacity
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon.AntDesign
              name="arrowleft"
              size={32}
              color={theme.secondaryText}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          onPress={close}
        >
          <Icon.AntDesign name="close" size={32} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

export default Modal;
