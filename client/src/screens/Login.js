import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import md5 from "react-native-md5";

import Constants from "../Constants";
class Login extends React.Component {
  state = {
    email: "",
    password: "",
    error: null,
  };

  login() {
    const {
      navigation,
      screenProps: { dispatch },
    } = this.props;
    const { email, password } = this.state;

    fetch(`${Constants.SERVER_ADDR}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: md5.str_md5(password) }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log("responseJson", responseJson);

        if (responseJson.error) {
          this.setState({ error: responseJson.error });
        } else {
          //go to map
          dispatch({ type: "SET_LOGGED", value: true });
          dispatch({ type: "SET_LOGIN_TOKEN", value: responseJson.loginToken });

          this.props.screenProps.reloadMe(responseJson.loginToken);

          this.setState({ error: null, success: responseJson.success });
        }

        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { navigation } = this.props;

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
          ) : null}

          {this.state.success ? (
            <Text style={{ color: "green" }}>{this.state.success}</Text>
          ) : (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 20 }}>Email</Text>

                <TextInput
                  placeholder="Email"
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
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
                <Text style={{ fontSize: 20 }}>Wachtwoord</Text>

                <TextInput
                  secureTextEntry
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
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
                  <Text style={{ fontSize: 20, color: "white" }}>Login</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("SignupEmail")}
                >
                  <Text
                    style={{
                      margin: 20,
                      fontSize: 20,
                      textDecorationLine: "underline",
                    }}
                  >
                    registreren
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text
                    style={{
                      margin: 20,
                      fontSize: 20,
                      textDecorationLine: "underline",
                    }}
                  >
                    wachtwoord vergeten?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default Login;
