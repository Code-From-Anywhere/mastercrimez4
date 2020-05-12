import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import T from "../components/T";
import { getRank, getStrength } from "../Util";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from "../Constants";

class Status extends Component {
  state = {
    response: null,
  };
  keyValue(key, value) {
    return (
      <View style={styles.row}>
        <T>{key}</T>
        <T>{value}</T>
      </View>
    );
  }
  render() {
    const { response } = this.state;

    const {
      navigation,
      screenProps: { me, reloadMe, device },
    } = this.props;

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        {me?.activated !== true ? (
          <TouchableOpacity onPress={() => navigation.navigate("SignupEmail")}>
            <View>
              <T>
                Je account is nog niet geactiveerd! Klik hier om je account te
                activeren
              </T>
            </View>
          </TouchableOpacity>
        ) : null}

        {response ? <T>{response}</T> : null}
        {me?.protectionAt > Date.now() ? (
          <TouchableOpacity
            onPress={() => {
              //haalweg
              fetch(`${Constants.SERVER_ADDR}/removeprotection`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: device.loginToken }),
              })
                .then((response) => response.json())
                .then(async ({ response }) => {
                  this.setState({ response });
                  reloadMe(device.loginToken);
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          >
            <View>
              <T>
                Je staat nog{" "}
                {Math.round((me?.protectionAt - Date.now()) / 3600000)} uur
                onder bescherming. Klik hier om het weg te halen
              </T>
            </View>
          </TouchableOpacity>
        ) : null}

        <View style={{ width: 200 }}>
          {this.keyValue("Contant", `€${me?.cash}`)}
          {this.keyValue("Bank", `€${me?.bank}`)}
          {this.keyValue("Kogels", me?.bullets)}
          {this.keyValue("GamePoints", me?.gamepoints)}
          {this.keyValue("Rank", getRank(me?.rank, "both"))}
          {this.keyValue("Moordrang", getStrength(me?.strength, "both"))}
          {this.keyValue("Leven", `${me?.health}%`)}
          {this.keyValue("Wiet", me?.wiet)}
          {this.keyValue("Junkies", me?.junkies)}
          {this.keyValue("Hoeren", me?.hoeren)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignItems: "center",
  },
});

export default Status;
