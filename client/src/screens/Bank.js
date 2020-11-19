import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { getTextFunction, numberFormat, post } from "../Util";

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

    const getText = getTextFunction(me?.locale);

    const { to, amount, type, response } = this.state;

    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ margin: 20, flex: 1 }}>
          {response ? (
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>
          ) : null}
          {this.keyValue(getText("cash"), numberFormat(me?.cash), () =>
            this.setState({ amount: String(me.cash) })
          )}
          {this.keyValue(getText("bank"), numberFormat(me?.bank), () =>
            this.setState({ amount: String(me.bank) })
          )}
          {this.keyValue(getText("rent"), getText("rentAmount"))}
          <View>
            <TextInput
              placeholderTextColor={theme.secondaryTextSoft}
              style={style(theme).textInput}
              placeholder={getText("amount")}
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
                title={getText("in")}
                onPress={() => this.deposit(true)}
                style={{ width: 80 }}
              />
              <Button
                theme={this.props.screenProps.device.theme}
                title={getText("out")}
                onPress={() => this.deposit(false)}
                style={{ width: 80 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
