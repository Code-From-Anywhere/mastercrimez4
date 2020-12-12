import React from "react";
import { FlatList, View } from "react-native";
import CountDown from "../components/Countdown";
import Constants from "../Constants";
import { getTextFunction, post } from "../Util";
import Button from "./Button";
import T from "./T";
class Jail extends React.Component {
  state = {
    jail: [],
  };
  componentDidMount() {
    this.fetchMembers();

    const { reloadMe, device } = this.props.screenProps;
    this.interval = setInterval(() => {
      reloadMe(device.loginToken);
      this.fetchMembers();
    }, 2500);
  }

  componentWillUnmount() {
    console.log("Clear interval jail");
    clearInterval(this.interval);
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

    return (
      <View style={{ flexDirection: "row" }}>
        <T>{item.name}</T>
        <CountDown
          style={{ marginLeft: 10 }}
          until={item.jailAt}
          digitStyle={{ backgroundColor: "#404040" }}
          digitTxtStyle={{ color: "white" }}
          size={8}
          timeToShow={["mm", "ss"]}
          timeLabels={{ m: null, s: null }}
        />
      </View>
    );
  };

  buyOut = async (type) => {
    const { device, reloadMe } = this.props.screenProps;
    const { response } = await post("buyout", {
      token: device.loginToken,
      type,
    });
    this.setState({ response });
    reloadMe(device.loginToken);
  };
  render() {
    const {
      screenProps: { me, device, reloadMe },
      navigation,
    } = this.props;

    const getText = getTextFunction(me?.locale);

    const { response } = this.state;
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <T>{getText("jailYoureInJail")}</T>

        <CountDown
          until={me.jailAt}
          size={20}
          timeToShow={["mm", "ss"]}
          timeLabels={{ mm: getText("minutes"), ss: getText("seconds") }}
        />

        <View style={{ height: 15 }} />

        {response && <T>{response}</T>}
        <Button
          style={{ marginVertical: 15 }}
          title={getText("jailBuyoutCredits")}
          onPress={() => this.buyOut("credits")}
        />
        <Button
          style={{ marginVertical: 15 }}
          title={getText("jailBuyoutCash")}
          onPress={() => this.buyOut("cash")}
        />

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
