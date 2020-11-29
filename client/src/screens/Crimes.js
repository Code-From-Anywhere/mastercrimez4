import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import Footer from "../components/Footer";
import ShareButtons from "../components/ShareButtons";
import Constants from "../Constants";
import { getTextFunction } from "../Util";

class Crimes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      response: null,
      captcha: "",
      random: Math.random(),
    };
  }

  renderItem = (item, index) => {
    const {
      me,
      device: { theme },
    } = this.props.screenProps;

    const kans = Math.round((me?.rank + 30) / (item.id * item.id));
    const maxChance = me?.profession === "thief" ? 99 : 75;
    const kans2 = kans > maxChance ? maxChance : kans;

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
          <Text style={{ color: theme.primaryText }}>{kans2}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  submit = () => {
    const { device } = this.props.screenProps;

    this.setState({ loading: true });
    fetch(`${Constants.SERVER_ADDR}/crime`, {
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
    const getText = getTextFunction(this.props.screenProps.me?.locale);

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
          style={{ borderRadius: 10, marginTop: 20 }}
          title={getText("steal")}
          onPress={this.submit}
        />

        <Footer screenProps={this.props.screenProps} />
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

    const getText = getTextFunction(me?.locale);

    const options = [
      {
        id: 1,
        option: getText("crimeOption1"),
      },
      {
        id: 2,
        option: getText("crimeOption2"),
      },

      {
        id: 3,
        option: getText("crimeOption3"),
      },

      {
        id: 4,
        option: getText("crimeOption4"),
      },

      {
        id: 5,
        option: getText("crimeOption5"),
      },
    ];

    return (
      <View style={{ margin: 20 }}>
        {response ? (
          <View style={{ flex: 1, minHeight: 400 }}>
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>

            {response.code && (
              <ShareButtons
                me={me}
                text={getText("crimeSuitcase")}
                url={`Case/${response.code}`}
              />
            )}

            <Button
              theme={theme}
              title={getText("ok")}
              onPress={() => this.setState({ response: null })}
            />
          </View>
        ) : (
          <ScrollView>
            {options.map(this.renderItem)}

            {this.renderFooter()}
          </ScrollView>
        )}
      </View>
    );
  }
}

export default Crimes;
