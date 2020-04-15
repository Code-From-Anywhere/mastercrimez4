import React from "react";
import { View, Linking, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

function appendLeadingZeroes(n) {
  if (n <= 9) {
    return "0" + n;
  }
  return n;
}

class Activity extends React.Component {
  render() {
    const { item, style } = this.props;

    const d = new Date(item.date);
    const datetime =
      d.getDate() +
      "-" +
      (d.getMonth() + 1) +
      " " +
      d.getHours() +
      ":" +
      appendLeadingZeroes(d.getMinutes());
    return (
      <View
        style={{
          backgroundColor: "#CCC",
          borderRadius: 10,
          margin: 20,
          padding: 20,
          ...style
        }}
      >
        <Text>{datetime}</Text>
        <Text>{item.title}</Text>
        <Text style={{ fontWeight: "bold" }}>{item.user?.name}</Text>
        <Text>
          ({item.user?.gender?.toUpperCase()}/{item.user?.age}){" "}
          {item.user?.city}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>Single:</Text>
          <Text>{item.user?.single ? "Ja" : "Nee"}</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>Snelheid:</Text>
          <Text>{item.kmph} km/u</Text>
        </View>

        {item.distance ? (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Afstand:</Text>
            <Text>{item.distance} km </Text>
          </View>
        ) : null}
        <Text>{item.description}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:${item.user?.email}`)}
          >
            <Ionicons name="ios-mail" size={32} />
          </TouchableOpacity>

          {item.user?.phone ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${item.user?.phone}`)}
            >
              <Ionicons name="ios-call" size={32} />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}

export default Activity;
