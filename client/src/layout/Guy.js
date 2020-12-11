import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import BottomSheet from "../react-native-bottom-sheet";

const Guy = ({ text, onClose, visible, button }) => {
  useEffect(() => {
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 1000);
  }, [visible, text]);
  // hooks
  const window = Dimensions.get("window");
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => [-1, "55%"], []);

  // callbacks
  const handleSheetChanges = useCallback(
    (index) => {
      if (index === 0) {
        onClose();
      }
    },
    [onClose]
  );

  return visible ? (
    <BottomSheet
      ref={bottomSheetRef}
      initialSnapIndex={1}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundComponent={() => <View />}
      animateOnMount={true}
    >
      <View
        style={{
          justifyContent: "flex-end",
          flex: 1,
        }}
      >
        <Image
          source={require("../../assets/gangster3.png")}
          style={{
            width: window.width < 380 ? window.width : 380,
            height: window.height * 0.5,
          }}
          resizeMode="contain"
          onLayout={({ nativeEvent: { layout } }) => console.log(layout)}
        />

        <View
          style={{
            position: "absolute",
            top: 70,
            left: 220,
            width: 120,
            height: 150,
            justifyContent: "space-between",
          }}
        >
          <Text>{text}</Text>
          <TouchableOpacity onPress={() => bottomSheetRef.current.collapse()}>
            <Text style={{ fontWeight: "bold" }}>{button ? button : "OK"}</Text>
          </TouchableOpacity>
        </View>

        {/* <View
              style={{ backgroundColor: "black", width: "100%", height: 100 }}
            /> */}
      </View>
    </BottomSheet>
  ) : null;
};

export default Guy;
