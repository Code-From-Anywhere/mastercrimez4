import * as Icon from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const Modal = ({ view, navigation, setView, children }) => {
  const theme = useSelector((state) => state.device.theme);
  return (
    <View
      style={{
        position: "absolute",
        top: view === "territories" ? 180 : view === "game" ? 130 : 110,
        bottom: view === "chat" ? 70 : 140,
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
          onPress={() => {
            if (
              view !== "game" &&
              view !== "territories" &&
              view !== "crimes"
            ) {
              setView("game");
            }

            navigation.popToTop();
          }}
        >
          <Icon.AntDesign name="close" size={32} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

export default Modal;
