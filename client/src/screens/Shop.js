import { Entypo } from "@expo/vector-icons";
import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { get, post } from "../Util";

const { width } = Dimensions.get("window");
const isSmall = width < 800;
class Shop extends Component {
  state = {
    response: null,
    type: "weapon",
  };
  componentDidMount() {
    this.fetchShop("weapon");
    this.fetchCities();
  }

  fetchCities = async () => {
    const { cities } = await get("cities");
    this.setState({ cities });
  };

  fetchShop = (type) => {
    const { device } = this.props.screenProps;

    fetch(
      `${Constants.SERVER_ADDR}/shop?token=${device.loginToken}&type=${type}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then(async (response) => {
        this.setState({ response, type });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  becomeOwner = async (city) => {
    const { type } = this.state;
    const { reloadMe, device } = this.props.screenProps;
    const { response } = await post("becomeOwner", {
      city,
      type:
        type === "weapon"
          ? "weaponShop"
          : type === "protection"
          ? "weaponShop"
          : type === "airplane"
          ? "airport"
          : type === "home"
          ? "estateAgent"
          : "garage",
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

    const { cities, type } = this.state;

    const propertyKey =
      type === "weapon"
        ? "weaponShop"
        : type === "protection"
        ? "weaponShop"
        : type === "airplane"
        ? "airport"
        : type === "home"
        ? "estateAgent"
        : "garage";

    const ownerKey = `${propertyKey}Owner`;
    const profitKey = `${propertyKey}Profit`;

    const propertyString =
      type === "weapon"
        ? "Wapenwinkel"
        : type === "protection"
        ? "Wapenwinkel"
        : type === "airplane"
        ? "Vliegveld"
        : type === "home"
        ? "Makelaar"
        : "Garage";
    return (
      <View style={{ margin: 15 }}>
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
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontWeight: "bold", color: theme.primaryText }}>
              {propertyString}
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
                  {city[ownerKey] ? (
                    <T>{city[ownerKey]}</T>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.becomeOwner(city.city)}
                    >
                      <T>(Niemand)</T>
                    </TouchableOpacity>
                  )}
                  {city[ownerKey] === me?.name ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ManageObject", {
                          type: propertyKey,
                          city: city.city,
                        })
                      }
                    >
                      <Entypo name="edit" color={theme.primaryText} size={12} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              <T>{city[profitKey]}</T>
            </View>
          );
        })}
      </View>
    );
  };

  renderMenu = (t, string, flex) => {
    const { response, type, buy } = this.state;
    const {
      navigation,
      screenProps: {
        device,
        device: { theme },
      },
    } = this.props;

    return (
      <TouchableOpacity
        style={{
          backgroundColor:
            type === t ? `${theme.secondary}88` : theme.secondary,
          borderBottomWidth: 1,
          borderRightWidth: 1,
          flex,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => this.fetchShop(t)}
      >
        <T>{string}</T>
      </TouchableOpacity>
    );
  };
  render() {
    const {
      navigation,
      screenProps: {
        device,
        device: { theme },
      },
    } = this.props;

    const { response, type, buy } = this.state;
    /*

*/

    return (
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            height: 60,
          }}
        >
          {this.renderMenu("weapon", "Wapens", 1)}
          {this.renderMenu("protection", "Bescherming", 2)}
          {this.renderMenu("airplane", "Vliegtuig", 1)}
          {this.renderMenu("home", "Makelaar", 1)}
          {this.renderMenu("garage", "Garage", 1)}
        </View>

        {buy ? (
          <View>
            <T>{buy}</T>
            <Button
              theme={this.props.screenProps.device.theme}
              title="OK"
              onPress={() => this.setState({ buy: null })}
            />
          </View>
        ) : response ? (
          <View>
            {response?.current?.image && (
              <Image
                style={{
                  width: isSmall ? width : 400,
                  height: 300,
                  resizeMode: "contain",
                }}
                source={{
                  uri: `${Constants.SERVER_ADDR}/${response?.current?.image}`,
                }}
              />
            )}
            <T style={{ alignSelf: "center" }}>
              Je hebt: {response?.current?.name || "Geen"}
            </T>

            {response?.next ? (
              <View>
                {response?.next?.image && (
                  <Image
                    style={{
                      width: isSmall ? width : 400,
                      height: 300,
                      resizeMode: "contain",
                    }}
                    source={{
                      uri: `${Constants.SERVER_ADDR}/${response?.next?.image}`,
                    }}
                  />
                )}
                <T style={{ alignSelf: "center" }}>
                  Koop: {response?.next?.name}
                </T>
                <T style={{ alignSelf: "center" }}>
                  Voor: &euro;{response?.next?.price},-
                </T>
                <Button
                  theme={this.props.screenProps.device.theme}
                  title="Koop"
                  onPress={() => {
                    fetch(`${Constants.SERVER_ADDR}/buy`, {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        loginToken: device.loginToken,
                        type,
                      }),
                    })
                      .then((response) => response.json())
                      .then(async (buy) => {
                        this.setState({ buy: buy.response });
                        this.fetchShop(type);
                        this.props.screenProps.reloadMe(device.loginToken);
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }}
                />
              </View>
            ) : null}
            {this.renderCities()}
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>
    );
  }
}

export default Shop;
