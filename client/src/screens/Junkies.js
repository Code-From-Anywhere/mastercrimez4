import React, { Component } from "react";
import { Text, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
// import { ReCaptcha } from "react-recaptcha-v3";

class Junkies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
    };
  }

  submit = () => {
    const { device, me } = this.props.screenProps;

    this.setState({ loading: true });
    fetch(`${Constants.SERVER_ADDR}/junkies`, {
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
        {this.keyValue("Junkies in bezit", me?.junkies)}

        <Button
          theme={this.props.screenProps.device.theme}
          // disabled={!this.state.captcha || this.state.loading}
          style={{ marginTop: 20 }}
          title="Train junkies"
          onPress={this.submit}
        />

        {/* <ReCaptcha
          sitekey={Constants.CAPTCHA}
          action="junkies"
          verifyCallback={(token) => this.setState({ captcha: token })}
        /> */}
      </View>
    );
  };

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
        <T style={{ marginRight: 20 }}>{key}</T>
        <T>{value}</T>
      </View>
    );
  }

  render() {
    const { response } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ margin: 20 }}>
          {response ? (
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white" }}>{response.response}</Text>

              <Button
                theme={this.props.screenProps.device.theme}
                title="Oke"
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

export default Junkies;
