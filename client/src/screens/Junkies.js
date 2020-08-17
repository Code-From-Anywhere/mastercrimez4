// import { ReCaptcha } from "react-recaptcha-v3";
import { Entypo } from "@expo/vector-icons";
import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import Constants from "../Constants";
import { post } from "../Util";

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
    return (
      <View>
        {this.keyValue("Junkies in bezit", me?.junkies)}

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
          title="Train junkies"
          onPress={this.submit}
        />

        {this.renderCities()}
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

  renderCities = () => {
    const {
      device: { theme },
      me,
      cities,
    } = this.props.screenProps;
    const { navigation } = this.props;

    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <View style={{ flex: 2 }}>
            <T bold>Stad</T>
          </View>
          <View
            style={{
              flex: 3,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <T bold>Leger des Heils</T>
            <T bold>Winst</T>
          </View>
        </View>
        {cities?.map((city, index) => {
          return (
            <View
              key={`i${index}`}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: "black",
              }}
            >
              <View style={{ flex: 2 }}>
                <T>{city.city}</T>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flex: 3,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {city.junkiesOwner ? (
                    <T>{city.junkiesOwner}</T>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.becomeOwner(city.city)}
                    >
                      <T>(Niemand)</T>
                    </TouchableOpacity>
                  )}
                  {city.junkiesOwner === me?.name ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ManageObject", {
                          type: "junkies",
                          city: city.city,
                        })
                      }
                    >
                      <Entypo name="edit" color={theme.primaryText} size={12} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View>
                  <T>{city.junkiesProfit}</T>
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  render() {
    const { response } = this.state;
    const {
      screenProps: {
        device: { theme },
      },
    } = this.props;
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
                title="Oke"
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
