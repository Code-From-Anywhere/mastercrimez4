import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Constants from "../Constants";
class Login extends React.Component {
  state = {
    email: "",
    error: null,
    success: null
  };

  login() {
    const { email, password } = this.state;
    fetch(`${Constants.SERVER_ADDR}/forgotpassword`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
      .then(response => response.json())
      .then(responseJson => {
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
      .catch(error => {
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
            borderRadius: 20
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
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontSize: 20 }}>Email</Text>

            <TextInput
              placeholder="Email"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              style={{ backgroundColor: "white", fontSize: 20 }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between"
            }}
          >
            <View />

            <TouchableOpacity
              style={{
                backgroundColor: "blue",
                paddingHorizontal: 30,
                padding: 10,
                borderRadius: 30
              }}
              onPress={() => this.login()}
            >
              <Text style={{ fontSize: 20, color: "white" }}>Herstel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
