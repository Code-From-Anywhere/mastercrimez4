import { Entypo } from "@expo/vector-icons";
import React, { Component } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { get, post } from "../Util";
// import { ReCaptcha } from "react-recaptcha-v3";

class Hoeren extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: null,
    };
  }

  componentDidMount() {
    this.fetchCities();
  }

  fetchCities = async () => {
    const { cities } = await get("cities");
    this.setState({ cities });
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
          theme={this.props.screenProps.device.theme}
          // disabled={!this.state.captcha || this.state.loading}
          style={{ marginTop: 20 }}
          title="Pimp hoeren"
          onPress={this.submit}
        />

        {this.renderCities()}
      </View>
    );
  };

  becomeOwner = async (city) => {
    const { reloadMe, device } = this.props.screenProps;
    const { response } = await post("becomeOwner", {
      city,
      type: "rld",
      token: device.loginToken,
    });
    this.fetchCities();
    reloadMe(device.loginToken);
  };

  renderCities = () => {
    const {
      device: { theme },
      me,
    } = this.props.screenProps;
    const { navigation } = this.props;

    const { cities } = this.state;

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
            <T bold>RLD</T>
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
                  {city.rldOwner ? (
                    <T>{city.rldOwner}</T>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.becomeOwner(city.city)}
                    >
                      <T>(Niemand)</T>
                    </TouchableOpacity>
                  )}
                  {city.rldOwner === me?.name ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ManageObject", {
                          type: "rld",
                          city: city.city,
                        })
                      }
                    >
                      <Entypo name="edit" color={theme.primaryText} size={12} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <T>{city.rldProfit}</T>
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
    const number = Math.ceil(Math.random() * 60);

    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ margin: 20 }}>
          {response ? (
            <View style={{ flex: 1, minHeight: 400 }}>
              <Image
                style={{ width: 100, height: 100 }}
                source={{
                  uri:
                    Constants.SERVER_ADDR + "/images/female/" + number + ".gif",
                }}
              />
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
            this.renderFooter()
          )}
        </View>
      </ScrollView>
    );
  }
}

export default Hoeren;
