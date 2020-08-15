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

  heal = (name) => {
    const {
      screenProps: { device },
    } = this.props;

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
  };
  renderForm() {
    const {
      screenProps: { device, me },
    } = this.props;

    const { name } = this.state;
    return (
      <View>
        <TextInput
          style={style(device.theme).textInput}
          placeholder="Naam"
          placeholderTextColor={device.theme.secondaryTextSoft}
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
        />
        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginTop: 20 }}
          title="Maak beter"
          onPress={() => this.heal(this.state.name)}
        />
        <Button
          theme={this.props.screenProps.device.theme}
          style={{ marginTop: 20 }}
          title="Maak jezelf beter"
          onPress={() => this.heal(me?.name)}
        />
      </View>
    );
  }
  render() {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;
    const { response } = this.state;

    return (
      <View style={style(theme).container}>
        <View style={{ margin: 20 }}>
          {response ? (
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>
          ) : null}

          {this.renderForm()}
        </View>
      </View>
    );
  }
}

export default Hospital;
