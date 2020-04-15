import React, { Component } from "react";
import { Image, Text, View, TextInput } from "react-native";
import Button from "../components/Button";
import style from "../Style";
import { connectActionSheet } from "@expo/react-native-action-sheet";

import Constants from "../Constants";

class Hospital extends Component {
  state = {
    response: null,
  };

  componentDidMount() {
    const name = this.props.navigation.state.params?.name;
    if (name) {
      this.setState({ name });
    }
  }

  renderFooter = () => {
    const { device } = this.props.screenProps;
    const { name } = this.state;

    return (
      <Button
        style={{ marginTop: 20 }}
        title="Maak beter"
        onPress={() => {
          fetch(`${Constants.SERVER_ADDR}/hospital`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loginToken: device.loginToken,
              name,
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
    );
  };

  renderForm() {
    return (
      <View>
        <TextInput
          style={style.textInput}
          placeholder="Naam"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
        />

        {this.renderFooter()}
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
      <View style={style.container}>
        <View style={{ margin: 20, width: 200 }}>
          {response ? (
            <Text style={{ color: "white" }}>{response.response}</Text>
          ) : null}

          {this.renderForm()}
        </View>
      </View>
    );
  }
}

export default Hospital;
