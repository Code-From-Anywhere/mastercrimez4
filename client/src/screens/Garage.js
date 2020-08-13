import React, { Component } from "react";
import { FlatList, Image, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
class Garage extends Component {
  state = {
    selected: null,
    response: null,
    cars: [],
    amount: {},
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { device } = this.props.screenProps;

    this.fetchGroups();

    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      this.fetchGroups();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  fetchGroups = () => {
    const { device } = this.props.screenProps;

    fetch(`${Constants.SERVER_ADDR}/garageGrouped?token=${device.loginToken}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (carGroups) => {
        this.setState({ carGroups });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  bulkAction = (action, auto, amount) => {
    const { loginToken } = this.props.screenProps.device;
    fetch(`${Constants.SERVER_ADDR}/bulkaction`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, action, auto, loginToken }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        this.setState({ response, auto, amount: {} });
        this.props.screenProps.reloadMe(loginToken);
        this.fetchGroups();
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
        this.fetchGroups();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderGroup = ({ item, index }) => {
    const {
      screenProps: { device },
    } = this.props;

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
          {(this.state.response && this.state.auto === item.auto) ||
          this.state.id === item.id ? (
            <Text>{this.state.response.response}</Text>
          ) : null}

          <Text style={{ color: "white" }}>{item.auto}</Text>
          <Text style={{ color: "white" }}>In bezit: {item.amount}</Text>
          <Text style={{ color: "white" }}>&euro;{item.cash}</Text>
          <Text style={{ color: "white" }}>{item.kogels} kogels</Text>
          <Text style={{ color: "white" }}>{item.power} power</Text>

          <TextInput
            key={`amount${item.id}`}
            style={style(device.theme).textInput}
            value={this.state.amount[item.id]}
            onChangeText={(x) =>
              this.setState({ amount: { ...this.state.amount, [item.id]: x } })
            }
            placeholder="Aantal"
          />
          <Button
            theme={this.props.screenProps.device.theme}
            title="Verkoop"
            onPress={() =>
              this.bulkAction("sell", item.auto, this.state.amount[item.id])
            }
          />

          <Button
            theme={this.props.screenProps.device.theme}
            title="Crush"
            onPress={() =>
              this.bulkAction("crush", item.auto, this.state.amount[item.id])
            }
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
          data={carGroups}
          renderItem={this.renderGroup}
        />
      </View>
    );
  }
}

export default Garage;
