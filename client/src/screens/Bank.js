import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";

class Bank extends Component {
  state = {
    response: null,
  };

  deposit = (deposit) => {
    const { device } = this.props.screenProps;

    fetch(`${Constants.SERVER_ADDR}/bank`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        amount: this.state.amount,
        deposit,
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
  };

  keyValue(key, value, onPress) {
    return (
      <View style={styles.row}>
        <T hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>{key}</T>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onPress}
        >
          <T>{value}</T>
        </TouchableOpacity>
      </View>
    );
  }

  renderFooter = () => {
    const { to, amount, type } = this.state;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <Button
          theme={this.props.screenProps.device.theme}
          title="In"
          onPress={() => this.deposit(true)}
          style={{ width: 80 }}
        />
        <Button
          theme={this.props.screenProps.device.theme}
          title="Uit"
          onPress={() => this.deposit(false)}
          style={{ width: 80 }}
        />
      </View>
    );
  };

  renderForm() {
    const {
      screenProps: {
        device: { theme },
      },
    } = this.props;

    return (
      <View>
        <TextInput
          style={style(theme).textInput}
          placeholder="Hoeveelheid"
          value={this.state.amount}
          onChangeText={(amount) => this.setState({ amount })}
        />
        {this.renderFooter()}
      </View>
    );
  }
  render() {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;
    const { response } = this.state;

    return (
      <View style={{ flex: 1, margin: 20, alignItems: "center" }}>
        <View style={{ width: 200 }}>
          {response ? (
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>
          ) : null}
          {this.keyValue("Contant", Intl.NumberFormat().format(me?.cash), () =>
            this.setState({ amount: String(me.cash) })
          )}
          {this.keyValue("Bank", Intl.NumberFormat().format(me?.bank), () =>
            this.setState({ amount: String(me.bank) })
          )}

          {this.renderForm()}
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
export default Bank;
