import { Entypo } from "@expo/vector-icons";
import React, { Component } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import CountDown from "react-native-countdown-component";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { post } from "../Util";
class Jail extends Component {
  state = {
    jail: [],
  };
  componentDidMount() {
    this.fetchMembers();
    this.props.screenProps.reloadCities();
  }

  fetchMembers(order) {
    fetch(`${Constants.SERVER_ADDR}/jail`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async ({ jail }) => {
        this.setState({ jail });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderItem = ({ item, index }) => {
    const {
      screenProps: { device, reloadMe },
    } = this.props;

    const seconds = Math.floor((item.jailAt - Date.now()) / 1000);

    return (
      <View style={{ flexDirection: "row" }}>
        <T>{item.name}</T>
        <CountDown
          style={{ marginLeft: 10 }}
          until={seconds}
          digitStyle={{ backgroundColor: "#404040" }}
          digitTxtStyle={{ color: "white" }}
          onFinish={() => {}}
          size={8}
          timeToShow={["M", "S"]}
          timeLabels={{ m: null, s: null }}
        />
        <Button
          theme={this.props.screenProps.device.theme}
          title="Breek uit"
          onPress={() => {
            fetch(`${Constants.SERVER_ADDR}/breakout`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: device.loginToken,
                name: item.name,
              }),
            })
              .then((response) => response.json())
              .then(async ({ response }) => {
                this.setState({ response });
                this.fetchMembers();
                reloadMe(device.loginToken);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
      </View>
    );
  };
  renderHeader = () => {
    return <T>{this.state.response}</T>;
  };

  becomeOwner = async (city) => {
    const { reloadMe, reloadCities, device } = this.props.screenProps;
    const { response } = await post("becomeOwner", {
      city,
      type: "jail",
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
            marginHorizontal: 15,
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
              Gevangenis
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
                paddingHorizontal: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: "black",
              }}
            >
              <View style={{ flex: 2 }}>
                <Text style={{ color: theme.primaryText }}>{city.city}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flex: 3,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {city.jailOwner ? (
                    <Text style={{ color: theme.primaryText }}>
                      {city.jailOwner}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.becomeOwner(city.city)}
                    >
                      <T>(Niemand)</T>
                    </TouchableOpacity>
                  )}
                  {city.jailOwner === me?.name ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ManageObject", {
                          type: "jail",
                          city: city.city,
                        })
                      }
                    >
                      <Entypo name="edit" color={theme.primaryText} size={12} />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <Text style={{ color: theme.primaryText }}>
                  {city.jailProfit}
                </Text>
              </View>
            </View>
          );
        })}
      </>
    );
  };
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.jail}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderCities}
          ListEmptyComponent={<T>Er zit niemand in de gevangenis</T>}
        />
      </View>
    );
  }
}

export default Jail;
