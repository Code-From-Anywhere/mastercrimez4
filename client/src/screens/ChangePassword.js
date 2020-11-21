import React from "react";
import { Text, TextInput, View } from "react-native";
import md5 from "react-native-md5";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";

class ChangePassword extends React.Component {
  state = {
    password1: "",
    password2: "",
    error: null,
    success: null,
  };

  login() {
    const getText = getTextFunction(this.props.screenProps.me?.locale);

    const token = this.props.screenProps.device.loginToken;

    const { password1, password2 } = this.state;

    if (password1 !== password2) {
      this.setState({ error: getText("passwordsDontMatch") });
      return;
    }

    fetch(`${Constants.SERVER_ADDR}/changePassword`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: md5.str_md5(password1), token }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responseJson", responseJson);

        if (responseJson.error) {
          this.setState({ success: null, error: responseJson.error });
        } else {
          this.setState(
            { error: null, success: responseJson.success },
            () => {}
          );
        }

        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const {
      navigation,
      screenProps: {
        device: { theme },
      },
    } = this.props;
    const getText = getTextFunction(this.props.screenProps.me?.locale);

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            padding: 20,
            minWidth: 200,
            borderRadius: 20,
          }}
        >
          {this.state.error ? (
            <Text style={{ color: "red" }}>{this.state.error}</Text>
          ) : this.state.success ? (
            <Text style={{ color: "green" }}>{this.state.success}</Text>
          ) : null}

          <View
            style={{
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 20, color: theme.primaryText }}>
              {getText("newPassword")}
            </Text>

            <TextInput
              secureTextEntry
              onChangeText={(password1) => this.setState({ password1 })}
              value={this.state.password1}
              style={style(theme).textInput}
            />
          </View>

          <View
            style={{
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 20, color: theme.primaryText }}>
              {getText("repeat")}
            </Text>

            <TextInput
              secureTextEntry
              onChangeText={(password2) => this.setState({ password2 })}
              value={this.state.password2}
              style={style(theme).textInput}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <View />

            <Button
              title={getText("changePassword")}
              onPress={() => this.login()}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default ChangePassword;
