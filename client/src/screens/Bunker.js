import React, { Component } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import { getTextFunction, post } from "../Util";

class Bunker extends Component {
  state = {
    selected: null,
    response: null,
    captcha: "",
    random: Math.random(),
  };
  renderItem = ({ item, index }) => {
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
          <Text style={{ color: theme.primaryText }}>&euro;{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    const { device, me } = this.props.screenProps;
    const getText = getTextFunction(me?.locale);

    return (
      <>
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
          title={getText("bunkerCTA")}
          onPress={async () => {
            const response = await post("bunker", {
              token: device.loginToken,
              option: this.state.selected,
              captcha: this.state.captcha,
            });
            this.setState({ response, captcha: "", random: Math.random() });
            this.props.screenProps.reloadMe(device.loginToken);
          }}
        />
      </>
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
    const getText = getTextFunction(me?.locale);

    const { response, selected } = this.state;

    const options = [
      {
        id: 1,
        option: getText("bunkerOneMinute"),
        price: "50000",
      },
      {
        id: 2,
        option: getText("bunkerFiveMinutes"),
        price: "250000",
      },

      {
        id: 3,
        option: getText("bunker15Minutes"),
        price: "1000000",
      },
    ];

    return (
      <View style={{ margin: 20 }}>
        {response ? (
          <View style={{ flex: 1, minHeight: 400 }}>
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>

            <Button
              theme={theme}
              title={getText("ok")}
              onPress={() => this.setState({ response: null })}
            />
          </View>
        ) : (
          <FlatList
            keyExtractor={(item, index) => `item${index}`}
            data={options}
            extraData={selected}
            ListHeaderComponent={() => <T>{getText("bunkerInfo")}</T>}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderFooter}
          />
        )}
      </View>
    );
  }
}

export default Bunker;
