import React, { Component } from "react";
import { Text, View } from "react-native";
// import { ReCaptcha } from "react-recaptcha-v3";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import Footer from "../components/Footer";
import T from "../components/T";
import Constants from "../Constants";
import { getTextFunction } from "../Util";

class Wiet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
      captcha: "",
      random: Math.random(),
    };
  }

  keyValue(key, value) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 40,
          alignItems: "center",
        }}
      >
        <T>{key}</T>
        <T>{value}</T>
      </View>
    );
  }

  submit = () => {
    const { device } = this.props.screenProps;

    this.setState({ loading: true });
    fetch(`${Constants.SERVER_ADDR}/oc`, {
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
        this.setState({
          response,
          loading: false,
          random: Math.random(),
          captcha: "",
        });
        this.props.screenProps.reloadMe(device.loginToken);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  renderFooter = () => {
    const { device, me } = this.props.screenProps;
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
          // disabled={!this.state.captcha || this.state.loading}
          style={{ marginTop: 20 }}
          title={getText("doOC")}
          onPress={this.submit}
        />

        <Footer screenProps={this.props.screenProps} />
      </View>
    );
  };
  render() {
    const { response } = this.state;
    const {
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ margin: 20 }}>
          {response ? (
            <View style={{ flex: 1, minHeight: 400 }}>
              <Text style={{ color: theme.primaryText }}>
                {response.response}
              </Text>

              <Button
                theme={this.props.screenProps.device.theme}
                title={getText("ok")}
                onPress={() => this.setState({ response: null })}
              />
            </View>
          ) : (
            this.renderFooter()
          )}
        </View>
      </View>
    );
  }
}

export default Wiet;
