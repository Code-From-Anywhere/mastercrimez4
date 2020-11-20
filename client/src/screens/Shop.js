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
import { getLocale, getTextFunction, post } from "../Util";

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
    this.props.screenProps.reloadCities();
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
      cities,
    } = this.props.screenProps;
    const { navigation } = this.props;

    const { type } = this.state;

    const getText = getTextFunction(me?.locale);

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
        ? getText("weaponShop")
        : type === "protection"
        ? getText("weaponShop")
        : type === "airplane"
        ? getText("airport")
        : type === "home"
        ? getText("estateAgent")
        : getText("garage");
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
              {getText("city")}
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
              {getText("profit")}
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
                      <T>{getText("nobody")}</T>
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
                <T>{city[profitKey]}</T>
              </View>
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
        me,
        device: { theme },
      },
    } = this.props;

    const { response, type, buy } = this.state;

    const getText = getTextFunction(me?.locale);
    const locale = getLocale(me?.locale);

    return (
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            height: 60,
          }}
        >
          {this.renderMenu("weapon", getText("weapons"), 1)}
          {this.renderMenu("protection", getText("protection"), 2)}
          {this.renderMenu("airplane", getText("airplane"), 1)}
          {this.renderMenu("home", getText("homeShop"), 1)}
          {this.renderMenu("garage", getText("garage"), 1)}
        </View>

        {buy ? (
          <View>
            <T>{buy}</T>
            <Button
              theme={this.props.screenProps.device.theme}
              title={getText("ok")}
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
              {getText("youHave")}:{" "}
              {response?.current?.name?.[locale] || getText("none")}
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
                  {getText("buy")}: {response?.next?.name?.[locale]}
                </T>
                <T style={{ alignSelf: "center" }}>
                  {getText("for")}: &euro;{response?.next?.price},-
                </T>
                <Button
                  theme={this.props.screenProps.device.theme}
                  title={getText("buy")}
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
