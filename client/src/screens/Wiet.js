import { Entypo } from "@expo/vector-icons";
import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import Constants from "../Constants";
import { post } from "../Util";

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
            <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
              Stad
            </Text>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
              Huisjesmelker
            </Text>
            <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
              Winst
            </Text>
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
                  {city.landlordOwner ? (
                    <T>{city.landlordOwner}</T>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.becomeOwner(city.city)}
                    >
                      <T>(Niemand)</T>
                    </TouchableOpacity>
                  )}
                  {city.landlordOwner === me?.name ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ManageObject", {
                          type: "landlord",
                          city: city.city,
                        })
                      }
                    >
                      <Entypo name="edit" color={theme.primaryText} size={12} />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <T>{city.landlordProfit}</T>
              </View>
            </View>
          );
        })}
      </>
    );
  };
  renderFooter = () => {
    const {
      device: { theme },
      me,
    } = this.props.screenProps;

    return (
      <ScrollView style={{ flex: 1 }}>
        {this.keyValue("Wiet in bezit", me?.wiet)}

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
          title="Teel wietplanten"
          onPress={this.submit}
        />

        {this.renderCities()}
      </ScrollView>
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
      <View style={{ flex: 1 }}>
        <View style={{ margin: 20, flex: 1 }}>
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
            this.renderFooter()
          )}
        </View>
      </View>
    );
  }
}

export default Wiet;
