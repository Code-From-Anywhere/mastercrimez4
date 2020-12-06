import { connectActionSheet } from "@expo/react-native-action-sheet";
import React, { Component } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";

class Donate extends Component {
  state = {
    response: null,
  };

  componentDidMount() {
    const to = this.props.navigation.state.params?.to;
    if (to) {
      this.setState({ to });
    }
  }

  renderFooter = () => {
    const { device, me } = this.props.screenProps;
    const { to, amount, type } = this.state;

    const getText = getTextFunction(me?.locale);

    return (
      <Button
        theme={this.props.screenProps.device.theme}
        style={{ marginTop: 20 }}
        title={getText("donate")}
        onPress={() => {
          fetch(`${Constants.SERVER_ADDR}/donate`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loginToken: device.loginToken,
              to,
              type,
              amount,
            }),
          })
            .then((response) => response.json())
            .then(async (response) => {
              this.setState({ response });
              this.props.screenProps.reloadMe(device.loginToken);
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      />
    );
  };

  openActionSheet = () => {
    const { me } = this.props.screenProps;
    const getText = getTextFunction(me?.locale);

    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [
      getText("bankMoney"),
      getText("bullets"),
      getText("weed"),
      getText("junkies"),
      getText("prostitutes"),
      getText("gamepoints"),
    ];
    const keys = ["bank", "bullets", "wiet", "junkies", "hoeren", "gamepoints"];
    this.props.showActionSheetWithOptions(
      {
        options,
        // cancelButtonIndex: null,
        // destructiveButtonIndex: null,
      },
      (buttonIndex) => {
        this.setState({ type: keys[buttonIndex] });
      }
    );
  };

  renderForm() {
    const {
      screenProps: { device, me },
    } = this.props;
    const getText = getTextFunction(me?.locale);

    const names = {
      bullets: getText("bullets"),
      bank: getText("bankMoney"),
      wiet: getText("weed"),
      junkies: getText("junkies"),
      hoeren: getText("prostitutes"),
      gamepoints: getText("gamepoints"),
    };
    return (
      <View>
        <TextInput
          style={style(device.theme).textInput}
          placeholderTextColor={device.theme.secondaryTextSoft}
          placeholder={getText("to")}
          value={this.state.to}
          onChangeText={(to) => this.setState({ to })}
        />
        <TextInput
          style={style(device.theme).textInput}
          placeholderTextColor={device.theme.secondaryTextSoft}
          placeholder={getText("amount")}
          value={this.state.amount}
          onChangeText={(amount) => this.setState({ amount })}
        />
        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginVertical: 10 }}
          title={
            this.state.type
              ? names[this.state.type]
              : getText("whatYouWantToDonate")
          }
          onPress={this.openActionSheet}
        />
        {this.renderFooter()}
      </View>
    );
  }
  render() {
    const {
      navigation,
      screenProps: { me, device },
    } = this.props;
    const { response } = this.state;

    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ margin: 20 }}>
          {response ? (
            <Text style={{ color: device.theme.primaryText }}>
              {response.response}
            </Text>
          ) : null}

          {this.renderForm()}
        </View>
      </ScrollView>
    );
  }
}

export default connectActionSheet(Donate);
