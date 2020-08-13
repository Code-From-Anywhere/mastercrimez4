import React, { Component } from "react";
import { Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";

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
        theme={this.props.screenProps.device.theme}
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
    const {
      screenProps: { device },
    } = this.props;

    return (
      <View>
        <TextInput
          style={style(device.theme).textInput}
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
      screenProps: { me, device },
    } = this.props;
    const { response } = this.state;

    return (
      <View style={style(device.theme).container}>
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
