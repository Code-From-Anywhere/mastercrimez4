import React from "react";
import { FlatList, View } from "react-native";
import CountDown from "react-native-countdown-component";
import Constants from "../Constants";
import Button from "./Button";
import T from "./T";
class Jail extends React.Component {
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
      screenProps: { device },
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
      </View>
    );
  };

  render() {
    const {
      screenProps: { me, device, reloadMe },
      navigation,
    } = this.props;
    const sec = Math.round((me.jailAt - Date.now()) / 1000);
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <T>Je zit in de gevangenis</T>

        <CountDown
          until={sec}
          size={20}
          timeToShow={["M", "S"]}
          timeLabels={{ m: "Minuten", s: "Seconden" }}
        />

        <View style={{ flexDirection: "row" }}>
          <View />
          <Button
            theme={device.theme}
            title="Vernieuw"
            onPress={() => {
              reloadMe(device.loginToken);
              this.fetchMembers();
            }}
          />
          <View />
        </View>
        <FlatList
          data={this.state.jail}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

export default Jail;
