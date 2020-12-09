import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const MapIcon = React.memo(({ view }) => {
  return (
    <TouchableOpacity
      key={`v${view.view}`}
      hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      style={{
        marginBottom: 10,
        backgroundColor: view.isActive ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.4)",
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={view.onPress}
    >
      <view.icon name={view.iconName} color="white" size={30} />
      {view.badgeCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "red",
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 10 }}>
            {view.badgeCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

export default MapIcon;
