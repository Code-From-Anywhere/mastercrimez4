import moment from "moment";
import React, { Component } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { getRank, getStrength, getTextFunction } from "../Util";
import MyObjects from "./MyObjects";

const professionReleaseDate = moment("15/03/2021", "DD/MM/YYYY").set(
  "hour",
  17
);

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
      screenProps,
      screenProps: { me, reloadMe, device },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    const uur = Math.round((me?.protectionAt - Date.now()) / 3600000);

    return (
      <ScrollView style={{ flex: 1 }}>
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
              <T>{getText("protectionInfo", uur)}</T>
            </View>
          </TouchableOpacity>
        ) : null}

        {me?.canChooseProfession &&
          (moment().isAfter(professionReleaseDate) || me?.level > 1) && (
            <View>
              <T>{getText("statusCanChooseProfessionText")}</T>
              <Button
                title={getText("statusCanChooseProfessionButton")}
                onPress={() => navigation.navigate("ChooseProfession")}
              />
            </View>
          )}

        <View style={{ marginHorizontal: 20 }}>
          {this.keyValue(getText("cash"), `€${me?.cash}`)}
          {this.keyValue(getText("bank"), `€${me?.bank}`)}
          {this.keyValue(getText("gamepoints"), me?.gamepoints)}
          {this.keyValue(getText("rank"), getRank(me?.rank, "both"))}
          {this.keyValue(
            getText("strength"),
            getStrength(me?.strength, "both")
          )}
          {this.keyValue(getText("health"), `${me?.health}%`)}
          {this.keyValue(getText("bullets"), me?.bullets)}
          {this.keyValue(getText("weed"), me?.wiet)}
          {this.keyValue(getText("junkies"), me?.junkies)}
          {this.keyValue(getText("prostitutes"), me?.hoeren)}
        </View>

        <MyObjects navigation={navigation} screenProps={screenProps} />
      </ScrollView>
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
