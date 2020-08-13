import React, { Component } from "react";
import { Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
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
    const {
      screenProps: {
        device: { theme },
      },
    } = this.props;
    return (
      <View>
        <TextInput
          style={style(theme).textInput}
          placeholder="Naam"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          style={style(theme).textInput}
          placeholder="Kogels"
          value={this.state.bullets}
          onChangeText={(bullets) => this.setState({ bullets })}
        />

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Button
            theme={this.props.screenProps.device.theme}
            title="Vermoord"
            onPress={() => this.kill()}
          />
        </View>
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
      <View style={{ flex: 1, margin: 20, alignItems: "center" }}>
        <View style={{ width: 200 }}>
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

export default Kill;
