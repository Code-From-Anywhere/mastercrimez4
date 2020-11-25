import * as Updates from "expo-updates";
import React from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import md5 from "react-native-md5";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";

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
          dispatch({ type: "SET_LOGIN_TOKEN", value: responseJson.loginToken });

          if (Platform.OS === "web") {
            location.reload();
          } else {
            Updates.reloadAsync();
          }

          this.setState({ error: null, success: responseJson.success });
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
        me,
        device: { theme },
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            margin: 20,
            padding: 20,
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
                  padding: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 20 }}>{getText("email")}</Text>

                <TextInput
                  placeholder={getText("email")}
                  placeholderTextColor={theme.secondaryTextSoft}
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
                  style={style(theme).textInput}
                />
              </View>

              <View
                style={{
                  padding: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 20 }}>{getText("password")}</Text>

                <TextInput
                  secureTextEntry
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
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
                  theme={theme}
                  title={getText("login")}
                  onPress={() => this.login()}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  flexWrap: "wrap",
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
                    {getText("register")}
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
                    {getText("forgotPassword")}
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
