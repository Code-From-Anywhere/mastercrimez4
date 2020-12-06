import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { withAlert } from "../components/AlertProvider";
import Button from "../components/Button";
import T from "../components/T";
import style from "../Style";
import { getTextFunction, post, withCaptcha } from "../Util";
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

  renderFooter() {
    const { alert } = this.props;
    const { me, device, reloadMe, reloadCities } = this.props.screenProps;

    const getText = getTextFunction(this.props.screenProps.me?.locale);

    const postGetIncome = async (type, captcha) => {
      const { response } = await post("income", {
        token: device.loginToken,
        captcha,
        type,
      });

      reloadMe(device.loginToken);
      reloadCities();
      alert(response, null, null, { key: "incomeResponse" });
    };
    const incomeAction = (type) =>
      withCaptcha(device.loginToken, me?.needCaptcha, getText, alert, (code) =>
        postGetIncome(type, code)
      );

    return (
      <View style={{ flexDirection: "column" }}>
        <Button
          title={"Haal Sex Shop inkomen op"}
          onPress={() => incomeAction("rld")}
          style={{ margin: 10 }}
        />
        <Button
          title={"Verkoop je wiet aan de coffeeshop"}
          onPress={() => incomeAction("landlord")}
          style={{ margin: 10 }}
        />
        <Button
          title={"Haal Junkies inkomen op (leger des heils)"}
          onPress={() => incomeAction("junkies")}
          style={{ margin: 10 }}
        />
      </View>
    );
  }

  renderForm() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View>
        {this.keyValue(getText("weed"), me?.wiet)}
        {this.keyValue(getText("junkies"), me?.junkies)}
        {this.keyValue(getText("prostitutes"), me?.hoeren)}

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
        <View style={{ margin: 20 }}>
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
export default withAlert(Income);
