import React, { Component } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Captcha from "../components/Captcha";
import T from "../components/T";
import { post } from "../Util";

const options = [
  {
    id: 1,
    option: "1 minuut",
    price: "50000",
  },
  {
    id: 2,
    option: "5 minuten",
    price: "250000",
  },

  {
    id: 3,
    option: "15 minuten",
    price: "1000000",
  },
];

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
    const { device } = this.props.screenProps;
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
          title="Duik onder"
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
    const { response, selected } = this.state;

    return (
      <View style={{ margin: 20 }}>
        {response ? (
          <View style={{ flex: 1, minHeight: 400 }}>
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>

            <Button
              theme={theme}
              title="OK"
              onPress={() => this.setState({ response: null })}
            />
          </View>
        ) : (
          <FlatList
            keyExtractor={(item, index) => `item${index}`}
            data={options}
            extraData={selected}
            ListHeaderComponent={() => (
              <T>
                Als je in de schuilkelder zit, kan je niet worden beroofd of
                vermoord.
              </T>
            )}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderFooter}
          />
        )}
      </View>
    );
  }
}

export default Bunker;
