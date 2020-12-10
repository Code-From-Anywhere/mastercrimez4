import React, { Component } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";
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
        me,
        device: { theme },
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View>
        <TextInput
          style={style(theme).textInput}
          placeholder={getText("name")}
          placeholderTextColor={theme.secondaryTextSoft}
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          style={style(theme).textInput}
          placeholder={getText("bullets")}
          placeholderTextColor={theme.secondaryTextSoft}
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
            title={getText("kill")}
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
      <ScrollView style={{ flex: 1 }}>
        <View style={{ margin: 20 }}>
          {response ? (
            <Text style={{ color: theme.primaryText }}>
              {response.response}
            </Text>
          ) : null}

          {this.renderForm()}
        </View>
      </ScrollView>
    );
  }
}

export default Kill;
