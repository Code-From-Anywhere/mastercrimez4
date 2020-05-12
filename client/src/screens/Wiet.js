import React, { Component } from "react";
import { Text, View } from "react-native";
import Constants from "../Constants";
import Button from "../components/Button";
import T from "../components/T";
import { ReCaptcha } from "react-recaptcha-v3";

class Wiet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
    };

    this.debouncedSubmit = _.debounce(this.submit, 1000);
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
    fetch(`${Constants.SERVER_ADDR}/wiet`, {
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
        this.setState({ response, loading: false });
        this.props.screenProps.reloadMe(device.loginToken);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  renderFooter = () => {
    const { device, me } = this.props.screenProps;
    return (
      <View>
        {this.keyValue("Wiet in bezit", me?.wiet)}

        <Button
          disabled={!this.state.captcha || this.state.loading}
          style={{ marginTop: 20 }}
          title="Teel wietplanten"
          onPress={this.debouncedSubmit}
        />

        <ReCaptcha
          sitekey={Constants.CAPTCHA}
          action="wiet"
          verifyCallback={(token) => this.setState({ captcha: token })}
        />
      </View>
    );
  };
  render() {
    const { response } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ margin: 20 }}>
          {response ? (
            <View style={{ flex: 1, minHeight: 400 }}>
              <Text style={{ color: "white" }}>{response.response}</Text>

              <Button
                title="OK"
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
