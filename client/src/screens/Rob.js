import React, { Component } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";

class Bank extends Component {
  componentDidMount() {
    const name = this.props.navigation.state.params?.name;
    if (name) {
      this.setState({ name });
    }
  }
  state = {
    response: null,
  };

  rob = () => {
    const { device } = this.props.screenProps;

    fetch(`${Constants.SERVER_ADDR}/rob`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        name: this.state.name,
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
  };

  renderForm() {
    return (
      <View>
        <TextInput
          style={{
            backgroundColor: this.props.screenProps.device.theme.secondary,
            padding: 5,
            fontSize: 24,
            borderRadius: 10,
            color: "white",
          }}
          placeholder="Naam"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
        />

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Button
            theme={this.props.screenProps.device.theme}
            title="Beroof"
            onPress={() => this.rob()}
          />
        </View>
      </View>
    );
  }
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { response } = this.state;

    return (
      <View style={{ flex: 1, margin: 20, alignItems: "center" }}>
        <View style={{ width: 200 }}>
          {response ? (
            <Text style={{ color: "white" }}>{response.response}</Text>
          ) : null}

          {this.renderForm()}

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation.navigate("Members", { order: 1 })}
          >
            <T>Zoek mensen met veel geld</T>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Bank;
