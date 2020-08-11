import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
// import { ReCaptcha } from "react-recaptcha-v3";
import style from "../Style";
class Income extends Component {
  state = {
    response: null,
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
    const { device } = this.props.screenProps;
    const { to, amount, type } = this.state;

    return (
      <View>
        <Button
          // disabled={!this.state.captcha}
          style={{ borderRadius: 10, marginTop: 20 }}
          title="Haal op"
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
                this.setState({ response });
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

    const incomeAt = me.incomeAt ? me.incomeAt : 0;
    const uren = Math.round((Date.now() - incomeAt) / 3600000);
    const uren2 = uren > 24 ? 24 : uren;
    const amount = Math.round(
      (me.junkies + me.hoeren + me.wiet) * 50 * Math.sqrt(uren2)
    );

    return (
      <View>
        {this.keyValue("Wiet", me?.wiet)}
        {this.keyValue("Junkies", me?.junkies)}
        {this.keyValue("Hoeren", me?.hoeren)}

        {this.keyValue("Uren", `${uren2} uur`)}
        {this.keyValue("Totale winst", `${amount},-`)}
        {this.renderFooter()}
      </View>
    );
  }
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { response } = this.state;

    return (
      <View style={style.container}>
        <View style={{ margin: 20, width: 200 }}>
          {response ? (
            <Text style={{ color: "white" }}>{response.response}</Text>
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
