import React, { Component } from "react";
import { Image, Text, View, FlatList, TouchableOpacity } from "react-native";
import Button from "../components/Button";

import Constants from "../Constants";
class Showroom extends Component {
  state = {
    selected: null,
    response: null,
    buyId: null,
  };

  componentDidMount() {
    fetch(`${Constants.SERVER_ADDR}/showroom`, {
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
  }

  buyCar = (id) => {
    const { loginToken } = this.props.screenProps.device;
    fetch(`${Constants.SERVER_ADDR}/buycar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, loginToken }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        this.props.screenProps.reloadMe(loginToken);

        this.setState({ response, buyId: id });
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
          source={{ uri: Constants.SERVER_ADDR + "/" + item.url }}
        />

        <View style={{ marginLeft: 20 }}>
          {this.state.response && this.state.buyId === item.id ? (
            <Text>{this.state.response.response}</Text>
          ) : null}

          <Text style={{ color: "white" }}>{item.naam}</Text>
          <Text style={{ color: "white" }}>&euro;{item.waarde}</Text>
          <Button title="Koop" onPress={() => this.buyCar(item.id)} />
        </View>
      </View>
    );
  };

  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { cars, buyId } = this.state;

    return (
      <View>
        <FlatList
          keyExtractor={(item, index) => `item${index}`}
          data={cars}
          extraData={buyId}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

export default Showroom;
