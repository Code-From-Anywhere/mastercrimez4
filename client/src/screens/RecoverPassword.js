import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import md5 from "react-native-md5";
import Constants from "../Constants";
import { getTextFunction } from "../Util";

class RecoverPassword extends React.Component {
  state = {
    password1: "",
    password2: "",
    error: null,
    success: null,
  };

  login() {
    const { me } = this.props.screenProps;

    const getText = getTextFunction(me?.locale);

    const { password1, password2 } = this.state;

    const { token } = this.props.navigation.state.params;

    if (!token) {
      this.setState({ error: getText("noToken") });
      return;
    }
    if (password1 !== password2) {
      this.setState({ error: getText("passwordsDontMatch") });
      return;
    }

    fetch(`${Constants.SERVER_ADDR}/forgotPassword2`, {
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
      screenProps: { me },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            margin: 20,
            padding: 20,
            minWidth: 200,
            backgroundColor: "#CCC",
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
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20 }}>{getText("newPassword")}</Text>

            <TextInput
              secureTextEntry
              onChangeText={(password1) => this.setState({ password1 })}
              value={this.state.password1}
              style={{ backgroundColor: "white", fontSize: 20 }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20 }}>{getText("repeat")}</Text>

            <TextInput
              secureTextEntry
              onChangeText={(password2) => this.setState({ password2 })}
              value={this.state.password2}
              style={{ backgroundColor: "white", fontSize: 20 }}
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

            <TouchableOpacity
              style={{
                backgroundColor: "blue",
                paddingHorizontal: 30,
                padding: 10,
                borderRadius: 30,
              }}
              onPress={() => this.login()}
            >
              <Text style={{ fontSize: 20, color: "white" }}>
                {getText("reset")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default RecoverPassword;
