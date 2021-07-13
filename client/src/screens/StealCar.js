/*
TODO:nudgen om push notificaties aan te zetten


*/

import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import CountDown from "../components/Countdown";
import T from "../components/T";
import Constants from "../Constants";
import { getTextFunction } from "../Util";

const { width } = Dimensions.get("window");
const isSmall = width < 800;

class StealCar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      captcha: "",
      random: Math.random(),
      response: null,
      type: "beginner",
    };
  }

  renderItem = ({ item, index }) => {
    const {
      me,
      device: { theme },
    } = this.props.screenProps;

    const kans = Math.round((me?.rank + 30) / (item.id * item.id));
    const kans2 = kans > 75 ? 75 : kans;

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
            paddingHorizontal: 20,
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

    this.setState({ loading: true }, () => {
      fetch(`${Constants.SERVER_ADDR}/stealcar`, {
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
          this.props.screenProps.reloadMe(device.loginToken);

          this.setState({
            response,
            loading: false,
            random: Math.random(),
            captcha: "",
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  renderFooter = () => {
    const {
      screenProps,
      screenProps: {
        me,

        device: { loginToken, theme },
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View>
        <Captcha
          screenProps={screenProps}
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

        {/* <ReCaptcha
          sitekey={Constants.CAPTCHA}
          action="stealcar"
          verifyCallback={(token) => this.setState({ captcha: token })}
        /> */}
      </View>
    );
  };

  renderMenu = (t, string) => {
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
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => this.setState({ type: t })}
      >
        <T>{string}</T>
      </TouchableOpacity>
    );
  };
  render() {
    const {
      navigation,
      screenProps: { me, device },
    } = this.props;
    const { response, selected, type } = this.state;

    const getText = getTextFunction(me?.locale);

    const seconds = Math.ceil((me.autostelenAt + 60000 - Date.now()) / 1000);

    const typeStart = type === "beginner" ? 0 : type === "serious" ? 6 : 12;

    const options = [
      {
        id: 1,
        option: getText("carOption1"),
      },
      {
        id: 2,
        option: getText("carOption2"),
      },

      {
        id: 3,
        option: getText("carOption3"),
      },

      {
        id: 4,
        option: getText("carOption4"),
      },

      {
        id: 5,
        option: getText("carOption5"),
      },

      {
        id: 6,
        option: getText("carOption6"),
      },

      {
        id: 7,
        option: getText("carOption7"),
      },

      {
        id: 8,
        option: getText("carOption8"),
      },

      {
        id: 9,
        option: getText("carOption9"),
      },

      {
        id: 10,
        option: getText("carOption10"),
      },

      {
        id: 11,
        option: getText("carOption11"),
      },

      {
        id: 12,
        option: getText("carOption12"),
      },

      {
        id: 13,
        option: getText("carOption13"),
      },

      {
        id: 14,
        option: getText("carOption14"),
      },

      {
        id: 15,
        option: getText("carOption15"),
      },
    ];

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            height: 60,
          }}
        >
          {this.renderMenu("beginner", getText("beginner"))}
          {this.renderMenu("serious", getText("advanced"))}
          {this.renderMenu("expert", getText("expert"))}
        </View>

        {response ? (
          <ScrollView style={{ flex: 1, minHeight: 400 }}>
            {response.cars
              ? response.cars.map((car) => {
                  return (
                    <Image
                      style={{
                        width: isSmall ? width : 400,
                        height: 300,
                        resizeMode: "contain",
                      }}
                      source={{
                        uri: Constants.SERVER_ADDR + "/" + car.url,
                      }}
                    />
                  );
                })
              : null}
            <Text style={{ color: device.theme.primaryText, margin: 10 }}>
              {response.response}
            </Text>

            {response.linkToGarage && (
              <Button
                style={{ margin: 10 }}
                title={getText("menuGarageShop")}
                onPress={() => navigation.navigate("GarageShop")}
              />
            )}

            <Button
              style={{ margin: 10 }}
              title={getText("ok")}
              onPress={() => this.setState({ response: null })}
            />
          </ScrollView>
        ) : seconds > 0 ? (
          <CountDown
            until={me.autostelenAt + 60000}
            onFinish={() => this.setState({ finished: true })}
            size={20}
            timeToShow={["mm", "ss"]}
            timeLabels={{ mm: getText("minutes"), ss: getText("seconds") }}
          />
        ) : (
          <FlatList
            keyExtractor={(item, index) => `item${index}`}
            data={options.slice(typeStart, typeStart + 6)}
            extraData={selected}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderFooter}
          />
        )}
      </View>
    );
  }
}

export default StealCar;
