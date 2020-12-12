import React, { Component } from "react";
import { FlatList, View } from "react-native";
import Button from "../components/Button";
import CountDown from "../components/Countdown";
import T from "../components/T";
import Constants from "../Constants";
import { getTextFunction } from "../Util";
class Jail extends Component {
  state = {
    jail: [],
  };
  componentDidMount() {
    this.fetchMembers();
  }

  fetchMembers() {
    fetch(`${Constants.SERVER_ADDR}/jail`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(({ jail }) => {
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

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <T>{item.name}</T>
        <CountDown
          style={{ marginLeft: 10 }}
          until={item.jailAt}
          digitStyle={{ backgroundColor: "#404040" }}
          digitTxtStyle={{ color: "white" }}
          size={8}
          timeToShow={["mm", "ss"]}
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

                setTimeout(() => {
                  this.fetchMembers();
                  reloadMe(device.loginToken);
                }, 200);
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

    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          extraData={this.state.jail.length}
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
