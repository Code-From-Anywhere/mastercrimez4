import { Entypo } from "@expo/vector-icons";
import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { get, post } from "../Util";
// import { ReCaptcha } from "react-recaptcha-v3";

class Wiet extends Component {
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

  becomeOwner = async (city) => {
    const { reloadMe, device } = this.props.screenProps;
    const { response } = await post("becomeOwner", {
      city,
      type: "landlord",
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
            <Text style={{ fontWeight: "bold" }}>Stad</Text>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Huisjesmelker</Text>
            <Text style={{ fontWeight: "bold" }}>Winst</Text>
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
                <Text>{city.city}</Text>
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
                    <Text>{city.landlordOwner}</Text>
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

                <Text>{city.landlordProfit}</Text>
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
    const { navigation } = this.props;

    const { cities } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        {this.keyValue("Wiet in bezit", me?.wiet)}

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
