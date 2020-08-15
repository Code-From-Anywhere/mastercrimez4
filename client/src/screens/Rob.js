import React, { Component } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import Footer from "../components/Footer";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";

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
    const {
      screenProps: {
        device: { theme },
      },
    } = this.props;
    return (
      <View>
        <TextInput
          style={style(theme).textInput}
          placeholderTextColor={theme.secondaryTextSoft}
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
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;
    const { response } = this.state;

    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ margin: 20 }}>
          {response ? (
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>
          ) : null}

          {this.renderForm()}

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation.navigate("Members", { order: 1 })}
          >
            <T>Zoek mensen met veel geld</T>
          </TouchableOpacity>
        </View>

        <Footer screenProps={this.props.screenProps} />
      </ScrollView>
    );
  }
}

export default Bank;
