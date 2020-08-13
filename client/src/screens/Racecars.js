import React, { Component } from "react";
import { FlatList, Image, Text, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";

class Garage extends Component {
  state = {
    selected: null,
    response: null,
    cars: [],
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

    fetch(`${Constants.SERVER_ADDR}/racecars?token=${device.loginToken}`, {
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

  upgradeCar = (id) => {
    const { loginToken } = this.props.screenProps.device;
    fetch(`${Constants.SERVER_ADDR}/upgradecar`, {
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
            <Text style={{ color: theme.primaryText }}>
              {this.state.response.response}
            </Text>
          ) : null}

          <Text style={{ color: theme.primaryText }}>{item.auto}</Text>
          <Text style={{ color: theme.primaryText }}>&euro;{item.cash}</Text>
          <Text style={{ color: theme.primaryText }}>{item.kogels} kogels</Text>
          <Text style={{ color: theme.primaryText }}>{item.power} power</Text>
          <Button
            theme={this.props.screenProps.device.theme}
            title="Verkoop"
            onPress={() => this.sellCar(item.id)}
          />
          <Button
            theme={this.props.screenProps.device.theme}
            title="Crush"
            onPress={() => this.crushCar(item.id)}
          />
          <Button
            theme={this.props.screenProps.device.theme}
            title="Upgrade"
            onPress={() => this.upgradeCar(item.id)}
          />
        </View>
      </View>
    );
  };

  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { cars, carGroups, id, view, filter } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item, index) => `item${index}`}
          data={cars?.filter((car) => car.auto === filter || !filter)}
          extraData={id}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default Garage;
