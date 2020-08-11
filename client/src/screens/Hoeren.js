import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
// import { ReCaptcha } from "react-recaptcha-v3";

class Hoeren extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
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
    fetch(`${Constants.SERVER_ADDR}/hoeren`, {
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
        {this.keyValue("Hoeren in bezit", me?.hoeren)}

        <Button
          // disabled={!this.state.captcha || this.state.loading}
          style={{ marginTop: 20 }}
          title="Pimp hoeren"
          onPress={this.submit}
        />

        {/* <ReCaptcha
          sitekey={Constants.CAPTCHA}
          action="hoeren"
          verifyCallback={(token) => this.setState({ captcha: token })}
        /> */}
      </View>
    );
  };
  render() {
    const { response } = this.state;

    const number = Math.ceil(Math.random() * 60);

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ margin: 20, width: 200 }}>
          {response ? (
            <View style={{ flex: 1, minHeight: 400 }}>
              <Image
                style={{ width: 100, height: 100 }}
                source={{
                  uri:
                    Constants.SERVER_ADDR + "/images/female/" + number + ".gif",
                }}
              />
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

export default Hoeren;
