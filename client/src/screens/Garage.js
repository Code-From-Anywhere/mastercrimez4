import React, { Component } from "react";
import { Image, Text, View, FlatList, TouchableOpacity } from "react-native";
import Button from "../components/Button";

import Constants from "../Constants";
class Garage extends Component {
  state = {
    selected: null,
    response: null,
    id: null,
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { device } = this.props.screenProps;

    this.fetchGarage();

    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      console.log("FETCH GARAGE");
      this.fetchGarage();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  fetchGarage = () => {
    const { device } = this.props.screenProps;

    fetch(`${Constants.SERVER_ADDR}/garage?token=${device.loginToken}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (cars) => {
        this.setState({ cars });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  sellCar = (id) => {
    const { loginToken } = this.props.screenProps.device;
    fetch(`${Constants.SERVER_ADDR}/sellcar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, loginToken }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        this.setState({ response, id });
        this.props.screenProps.reloadMe(loginToken);
        this.fetchGarage();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  crushCar = (id) => {
    const { loginToken } = this.props.screenProps.device;
    fetch(`${Constants.SERVER_ADDR}/crushcar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, loginToken }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        this.setState({ response, id });
        this.props.screenProps.reloadMe(loginToken);
        this.fetchGarage();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        key={`item${index}`}
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "black",
        }}
      >
        <Image
          style={{
            width: 350,
            height: 300,
            resizeMode: "contain",
          }}
          source={{ uri: Constants.SERVER_ADDR + "/" + item.image }}
        />

        <View style={{ marginLeft: 20 }}>
          {this.state.response && this.state.id === item.id ? (
            <Text>{this.state.response.response}</Text>
          ) : null}

          <Text style={{ color: "white" }}>{item.auto}</Text>
          <Text style={{ color: "white" }}>&euro;{item.cash}</Text>
          <Text style={{ color: "white" }}>{item.kogels} kogels</Text>
          <Button title="Verkoop" onPress={() => this.sellCar(item.id)} />
          <Button title="Crush" onPress={() => this.crushCar(item.id)} />
        </View>
      </View>
    );
  };

  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { cars, id } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item, index) => `item${index}`}
          data={cars}
          extraData={id}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

export default Garage;
