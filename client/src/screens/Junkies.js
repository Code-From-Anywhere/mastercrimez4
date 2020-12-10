// import { ReCaptcha } from "react-recaptcha-v3";
import React, { Component } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import Constants from "../Constants";
import { getTextFunction, post } from "../Util";

class Junkies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
      random: Math.random(),
      captcha: "",
    };
  }

  componentDidMount() {
    this.props.screenProps.reloadCities();
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
        {this.keyValue(getText("junkiesInPossession"), me?.junkies)}

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
          title={getText("trainJunkies")}
          onPress={this.submit}
        />
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

  becomeOwner = async (city) => {
    const { reloadMe, device, reloadCities } = this.props.screenProps;
    const { response } = await post("becomeOwner", {
      city,
      type: "junkies",
      token: device.loginToken,
    });
    reloadCities();
    reloadMe(device.loginToken);
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
      <ScrollView style={{ flex: 1 }}>
        <View style={{ margin: 20 }}>
          {response ? (
            <View>
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
      </ScrollView>
    );
  }
}

export default Junkies;
