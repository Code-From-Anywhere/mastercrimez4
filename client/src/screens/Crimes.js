import React, { Component } from "react";
import { Image, Text, View, FlatList, TouchableOpacity } from "react-native";
import Button from "../components/Button";
import { ReCaptcha } from "react-recaptcha-v3";

import Constants from "../Constants";

const options = [
  {
    id: 1,
    option: "Overval een gehandicapte",
  },
  {
    id: 2,
    option: "Beroof de politie",
  },

  {
    id: 3,
    option: "Steel zakgeld van een kind",
  },

  {
    id: 4,
    option: "Beroof een hoer",
  },

  {
    id: 5,
    option: "Steel geld van je moeder",
  },
];

class Crimes extends Component {
  state = {
    selected: null,
    response: null,
  };
  renderItem = ({ item, index }) => {
    const { me } = this.props.screenProps;

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
            justifyContent: "space-between",
            backgroundColor,
          }}
        >
          <Text style={{ color: "white" }}>{item.option}</Text>
          <Text style={{ color: "white" }}>{kans2}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    const { device } = this.props.screenProps;
    return (
      <View>
        <Button
          disabled={!this.state.captcha}
          style={{ borderRadius: 10, marginTop: 20 }}
          title="Steel"
          onPress={() => {
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
                this.setState({ response });
                this.props.screenProps.reloadMe(device.loginToken);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />

        <ReCaptcha
          sitekey={Constants.CAPTCHA}
          action="crime"
          verifyCallback={(token) => this.setState({ captcha: token })}
        />
      </View>
    );
  };
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { response, selected } = this.state;

    return (
      <View style={{ margin: 20 }}>
        {response ? (
          <View style={{ flex: 1, minHeight: 400 }}>
            <Text style={{ color: "white" }}>{response.response}</Text>

            <Button
              title="OK"
              onPress={() => this.setState({ response: null })}
            />
          </View>
        ) : (
          <FlatList
            keyExtractor={(item, index) => `item${index}`}
            data={options}
            extraData={selected}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderFooter}
          />
        )}
      </View>
    );
  }
}

export default Crimes;