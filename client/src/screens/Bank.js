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
import style from "../Style";
import { post } from "../Util";

class Bank extends Component {
  state = {
    response: null,
  };

  deposit = async (deposit) => {
    const { device } = this.props.screenProps;

    const response = await post("bank", {
      token: device.loginToken,
      amount: this.state.amount,
      deposit,
    });

    this.setState({ response });
    this.props.screenProps.reloadMe(device.loginToken);
  };

  keyValue(key, value, onPress) {
    return (
      <View style={styles.row}>
        <T hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>{key}</T>
        <TouchableOpacity
          disabled={!onPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onPress}
        >
          <T>{value}</T>
        </TouchableOpacity>
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

    const { to, amount, type, response } = this.state;

    return (
      <View style={{ flex: 1, margin: 20 }}>
        <View>
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
          {this.keyValue("Rente", "5% per dag")}
          <View>
            <TextInput
              style={style(theme).textInput}
              placeholder="Hoeveelheid"
              value={this.state.amount}
              onChangeText={(amount) => this.setState({ amount })}
            />

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
          </View>
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
