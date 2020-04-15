import React from "react";
import { View, Image } from "react-native";
import Button from "./Button";
import T from "./T";
import Constants from "../Constants";
class Dead extends React.Component {
  state = {
    selected: null,
    response: null,
  };
  render() {
    const {
      screenProps: { me, device, reloadMe },
      navigation,
    } = this.props;
    const sec = Math.round((me.reizenAt - Date.now()) / 1000);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View>
          <Image
            source={require("../../assets/dood.jpg")}
            style={{ width: 402, height: 424 }}
          />
          {this.state.response ? <T>{this.state.response.response}</T> : null}
          <Button
            title="Word levend"
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
      </View>
    );
  }
}

export default Dead;
