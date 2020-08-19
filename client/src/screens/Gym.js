import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import Constants from "../Constants";
import { getStrength } from "../Util";
// import { ReCaptcha } from "react-recaptcha-v3";

const options = [
  {
    id: 1,
    option: "Doe pullups",
  },
  {
    id: 2,
    option: "Doe pushups",
  },

  {
    id: 3,
    option: "Doe situps",
  },
];

class Gym extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
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

  renderHeader = () => {
    const {
      screenProps: { me },
    } = this.props;
    return (
      <View>
        {this.keyValue("Je moordrang", getStrength(me?.strength, "both"))}
      </View>
    );
  };
  renderItem = (item, index) => {
    const {
      screenProps: {
        device: { theme },
      },
    } = this.props;
    const backgroundColor =
      this.state.selected === item.id ? "#2c98f0" : undefined;
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ selected: item.id });
        }}
      >
        <View
          key={`item${index}`}
          style={{
            flexDirection: "row",
            borderRadius: 10,
            padding: 10,
            justifyContent: "space-between",
            backgroundColor,
          }}
        >
          <Text style={{ color: theme.primaryText }}>{item.option}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  submit = () => {
    const { device } = this.props.screenProps;

    this.setState({ loading: true });
    fetch(`${Constants.SERVER_ADDR}/gym`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        option: this.state.selected,
        captcha: this.state.captcha,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        this.setState({
          response,
          loading: false,
          captcha: "",
          random: Math.random(),
        });
        this.props.screenProps.reloadMe(device.loginToken);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderFooter = () => {
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
          style={{ borderRadius: 10, marginTop: 20 }}
          title="Train"
          onPress={this.submit}
        />
      </View>
    );
  };
  render() {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;
    const { response, selected } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ margin: 20, width: 300 }}>
          {response ? (
            <View style={{ flex: 1, minHeight: 400 }}>
              <Text style={{ color: theme.primaryText }}>
                {response.response}
              </Text>

              <Button
                theme={this.props.screenProps.device.theme}
                title="OK"
                onPress={() => this.setState({ response: null })}
              />
            </View>
          ) : (
            <ScrollView>
              {this.renderHeader()}

              {options.map(this.renderItem)}

              {this.renderFooter()}
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
}

export default Gym;
