import React, { Component } from "react";
import { Text, FlatList, View } from "react-native";
import CountDown from "react-native-countdown-component";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
class Jail extends Component {
  state = {
    jail: [],
  };
  componentDidMount() {
    this.fetchMembers();
  }

  fetchMembers(order) {
    fetch(`${Constants.SERVER_ADDR}/jail`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async ({ jail }) => {
        this.setState({ jail });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderItem = ({ item, index }) => {
    const {
      screenProps: { device, reloadMe },
    } = this.props;

    const seconds = Math.floor((item.jailAt - Date.now()) / 1000);

    return (
      <View style={{ flexDirection: "row" }}>
        <T>{item.name}</T>
        <CountDown
          style={{ marginLeft: 10 }}
          until={seconds}
          digitStyle={{ backgroundColor: "#404040" }}
          digitTxtStyle={{ color: "white" }}
          onFinish={() => {}}
          size={8}
          timeToShow={["M", "S"]}
          timeLabels={{ m: null, s: null }}
        />
        <Button
          title="Breek uit"
          onPress={() => {
            fetch(`${Constants.SERVER_ADDR}/breakout`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: device.loginToken,
                name: item.name,
              }),
            })
              .then((response) => response.json())
              .then(async ({ response }) => {
                this.setState({ response });
                this.fetchMembers();
                reloadMe(device.loginToken);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
      </View>
    );
  };
  renderHeader = () => {
    return <T>{this.state.response}</T>;
  };

  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <FlatList
          data={this.state.jail}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={<T>Er zit niemand in de gevangenis</T>}
        />
      </View>
    );
  }
}

export default Jail;