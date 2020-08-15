import React from "react";
import { Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
class Login extends React.Component {
  state = {
    email: "",
    error: null,
    success: null,
  };

  login() {
    const { email, password } = this.state;
    fetch(`${Constants.SERVER_ADDR}/forgotpassword`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
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

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            margin: 20,
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
            <Text style={{ fontSize: 20 }}>Email</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor={theme.secondaryTextSoft}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
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
              onPress={() => this.login()}
              title={"Herstel"}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
