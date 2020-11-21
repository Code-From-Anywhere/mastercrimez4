import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";
class Income extends Component {
  state = {
    response: null,
    captcha: "",
    random: Math.random(),
  };
  keyValue(key, value) {
    return (
      <View style={styles.row}>
        <T>{key}</T>
        <T>{value}</T>
      </View>
    );
  }

  renderFooter = () => {
    const { device, me } = this.props.screenProps;
    const { to, amount, type } = this.state;

    const getText = getTextFunction(me?.locale);

    return (
      <View>
        <Captcha
          screenProps={this.props.screenProps}
          captcha={this.state.captcha}
          onChangeCaptcha={(x) => this.setState({ captcha: x })}
          random={this.state.random}
          onChangeRandom={(x) => this.setState({ random: x })}
        />

        <Button
          theme={this.props.screenProps.device.theme}
          // disabled={!this.state.captcha}
          style={{ borderRadius: 10, marginTop: 20 }}
          title={getText("getCTA")}
          onPress={() => {
            fetch(`${Constants.SERVER_ADDR}/income`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: device.loginToken,
                captcha: this.state.captcha,
              }),
            })
              .then((response) => response.json())
              .then(async (response) => {
                this.setState({ response, captcha: "", random: Math.random() });
                this.props.screenProps.reloadMe(device.loginToken);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />

        {/* <ReCaptcha
          sitekey={Constants.CAPTCHA}
          action="income"
          verifyCallback={(token) => this.setState({ captcha: token })}
        /> */}
      </View>
    );
  };

  renderForm() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    const incomeAt = me.incomeAt ? me.incomeAt : 0;
    const uren = Math.round((Date.now() - incomeAt) / 3600000);
    const uren2 = uren > 24 ? 24 : uren;
    const amount = Math.round(
      (me.junkies + me.hoeren + me.wiet) * 50 * Math.sqrt(uren2)
    );

    return (
      <View>
        {this.keyValue(getText("weed"), me?.wiet)}
        {this.keyValue(getText("junkies"), me?.junkies)}
        {this.keyValue(getText("prostitutes"), me?.hoeren)}

        {this.keyValue(getText("hours"), getText("xHours", uren2))}
        {this.keyValue(getText("totalProfit"), `${amount},-`)}
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
      <View style={style(device.theme).container}>
        <View style={{ margin: 20, width: 200 }}>
          {response ? (
            <Text style={{ color: device.theme.primaryText }}>
              {response.response}
            </Text>
          ) : (
            this.renderForm()
          )}
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
export default Income;
