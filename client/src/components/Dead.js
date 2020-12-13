import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Constants from "../Constants";
import { getTextFunction } from "../Util";
import Button from "./Button";
class Dead extends React.Component {
  state = {
    selected: null,
    response: null,
  };
  render() {
    const {
      screenProps: { me, device, reloadMe },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("../../assets/dood.jpg")}
            style={{ width: 402, height: 424 }}
          />
          {this.state.response ? (
            <Text style={{ color: device.theme.primaryText }}>
              {this.state.response.response}
            </Text>
          ) : null}
          <Button
            title={getText("deadBecomeAlive")}
            onPress={() => {
              fetch(`${Constants.SERVER_ADDR}/getalive`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: device.loginToken,
                  option: this.state.selected,
                }),
              })
                .then((response) => response.json())
                .then(async (response) => {
                  reloadMe(device.loginToken);

                  this.setState({ response });
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

export default Dead;
