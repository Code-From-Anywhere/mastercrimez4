import React from "react";
import { TouchableOpacity } from "react-native";

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
    </TouchableOpacity>
  );
});

export default MapIcon;
