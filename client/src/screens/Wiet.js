import React, { Component } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import Constants from "../Constants";
import { getTextFunction, post } from "../Util";

class Wiet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
      captcha: "",
      random: Math.random(),
    };
  }

  componentDidMount() {
    this.props.screenProps.reloadCities();
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

  becomeOwner = async (city) => {
    const { reloadMe, device, reloadCities } = this.props.screenProps;
    const { response } = await post("becomeOwner", {
      city,
      type: "landlord",
      token: device.loginToken,
    });
    reloadCities();

    reloadMe(device.loginToken);
  };
  renderFooter = () => {
    const {
      device: { theme },
      me,
    } = this.props.screenProps;

    const getText = getTextFunction(me?.locale);

    return (
      <ScrollView style={{ flex: 1 }}>
        {this.keyValue(getText("weedInPossession"), me?.wiet)}

        <Captcha
          screenProps={this.props.screenProps}
          captcha={this.state.captcha}
          onChangeCaptcha={(x) => this.setState({ captcha: x })}
          random={this.state.random}
          onChangeRandom={(x) => this.setState({ random: x })}
        />

        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginTop: 20 }}
          title={getText("teelWeed")}
          onPress={this.submit}
        />
      </ScrollView>
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
      <View style={{ flex: 1 }}>
        <View style={{ margin: 20, flex: 1 }}>
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
