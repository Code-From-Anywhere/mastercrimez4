import React, { Component } from "react";
import { Image, Text, View, FlatList, TouchableOpacity } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
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

    fetch(`${Constants.SERVER_ADDR}/garage?token=${device.loginToken}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (cars) => {
        const carGroups = cars
          ?.map((car, index) =>
            cars.findIndex((c) => c.auto === car.auto) < index
              ? null
              : {
                  car: car.auto,
                  amount: cars.filter((c) => c.auto === car.auto).length,
                }
          )
          .filter((x) => x !== null);

        this.setState({ cars, carGroups });
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

  renderHeader = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Button
          onPress={() => this.setState({ view: "groups" })}
          title="Groepeer"
        />
        <Button
          onPress={() => this.setState({ view: "all", filter: null })}
          title="Alles"
        />
      </View>
    );
  };

  renderGroup = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ view: "all", filter: item.car })}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <T>{item.car}</T>
          <T>{item.amount}</T>
        </View>
      </TouchableOpacity>
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
        {view === "groups" ? (
          <FlatList
            keyExtractor={(item, index) => `item${index}`}
            data={carGroups}
            renderItem={this.renderGroup}
            ListHeaderComponent={this.renderHeader}
          />
        ) : (
          <FlatList
            keyExtractor={(item, index) => `item${index}`}
            data={cars?.filter((car) => car.auto === filter || !filter)}
            extraData={id}
            renderItem={this.renderItem}
            ListHeaderComponent={this.renderHeader}
          />
        )}
      </View>
    );
  }
}

export default Garage;
