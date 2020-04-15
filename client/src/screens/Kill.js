import React, { Component } from "react";
import {
  Image,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";

class Kill extends Component {
  componentDidMount() {
    const name = this.props.navigation.state.params?.name;
    if (name) {
      this.setState({ name });
    }
  }

  state = {
    response: null,
  };

  kill = () => {
    const { device } = this.props.screenProps;

    fetch(`${Constants.SERVER_ADDR}/kill`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        name: this.state.name,
        bullets: this.state.bullets,
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
            backgroundColor: "#222",
            fontSize: 24,
            borderRadius: 10,
            color: "white",
            marginBottom: 20,
          }}
          placeholder="Naam"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          style={{
            backgroundColor: "#222",
            fontSize: 24,
            borderRadius: 10,
            color: "white",
          }}
          placeholder="Kogels"
          value={this.state.bullets}
          onChangeText={(bullets) => this.setState({ bullets })}
        />

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Button title="Vermoord" onPress={() => this.kill()} />
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
        </View>
      </View>
    );
  }
}

export default Kill;
