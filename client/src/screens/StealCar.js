import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CountDown from "react-native-countdown-component";
// import { ReCaptcha } from "react-recaptcha-v3";
import Button from "../components/Button";
import Constants from "../Constants";
const { width } = Dimensions.get("window");
const isSmall = width < 800;

const options = [
  {
    id: 1,
    option: "Steel een auto bij de supermarkt",
  },
  {
    id: 2,
    option: "Steel een auto bij een disco",
  },

  {
    id: 3,
    option: "Ga bij de gevonden voorwerpen langs op zoek naar een autosleutel",
  },

  {
    id: 4,
    option: "Steel een auto uit een arme wijk",
  },

  {
    id: 5,
    option: "Steel een auto van een parkeerplaats",
  },

  {
    id: 6,
    option: "Steel een auto bij een restaurant",
  },

  {
    id: 7,
    option:
      "Doe alsof je gewond bent, en steel de auto als de automobilist naar je toe komt om je te helpen.",
  },

  {
    id: 8,
    option: "Steel een auto uit een parkeergarage",
  },

  {
    id: 9,
    option: "Steel een auto in het winkelcentrum",
  },

  {
    id: 10,
    option: "Steel een auto van een oprit",
  },

  {
    id: 11,
    option: "Steel een auto bij een showroom",
  },

  {
    id: 12,
    option: "Steel een auto bij een villa",
  },

  {
    id: 13,
    option: "Steel sleutels op de miljonairsclub",
  },

  {
    id: 14,
    option: "Steel een legendarische auto",
  },

  {
    id: 15,
    option: "Jat een auto in een wagenpark",
  },
];

class StealCar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      response: null,
    };
  }

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
            paddingHorizontal: 20,
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

          this.setState({ response, loading: false });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  renderFooter = () => {
    return (
      <View>
        <Button
          theme={this.props.screenProps.device.theme}
          // disabled={!this.state.captcha || this.state.loading}
          style={{ borderRadius: 10, marginTop: 20 }}
          title="Steel"
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

  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { response, selected } = this.state;

    const seconds = Math.ceil((me.autostelenAt + 60000 - Date.now()) / 1000);
    return (
      <View>
        {response ? (
          <View style={{ flex: 1, minHeight: 400 }}>
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
            <Text style={{ color: "white" }}>{response.response}</Text>

            <Button
              theme={this.props.screenProps.device.theme}
              title="OK"
              onPress={() => this.setState({ response: null })}
            />
          </View>
        ) : seconds > 0 ? (
          <CountDown
            until={seconds}
            onFinish={() => this.setState({ finished: true })}
            size={20}
            timeToShow={["M", "S"]}
            timeLabels={{ m: "Minuten", s: "Seconden" }}
          />
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

export default StealCar;
