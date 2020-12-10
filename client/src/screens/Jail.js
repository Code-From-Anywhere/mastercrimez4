import React, { Component } from "react";
import { FlatList, View } from "react-native";
import CountDown from "react-native-countdown-component";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { getTextFunction, post } from "../Util";
class Jail extends Component {
  state = {
    jail: [],
  };
  componentDidMount() {
    this.fetchMembers();
    this.props.screenProps.reloadCities();
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
      screenProps: { me, device, reloadMe },
    } = this.props;

    const getText = getTextFunction(me?.locale);

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
          theme={this.props.screenProps.device.theme}
          title={getText("breakOut")}
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

  becomeOwner = async (city) => {
    const { reloadMe, reloadCities, device } = this.props.screenProps;
    const { response } = await post("becomeOwner", {
      city,
      type: "jail",
      token: device.loginToken,
    });
    reloadCities();
    reloadMe(device.loginToken);
  };

  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.jail}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
          ListEmptyComponent={<T>{getText("jailEmpty")}</T>}
        />
      </View>
    );
  }
}

export default Jail;
