import React from "react";
import { Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";

class Login extends React.Component {
  state = {
    phone: "",
    error: null,
    success: null,
  };

  save() {
    const { navigation } = this.props;

    const token = this.props.screenProps.device.loginToken;

    const { phone } = this.state;

    fetch(`${Constants.SERVER_ADDR}/setPhone`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, token }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responseJson", responseJson);

        this.setState({ response: responseJson.response });

        if (responseJson.success) {
          navigation.navigate("VerifyPhoneCode");
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
            flex: 1,
            margin: 20,
            padding: 20,
            backgroundColor: "#CCC",
            borderRadius: 20,
          }}
        >
          {this.state.response ? <Text>{this.state.response}</Text> : null}

          <View
            style={{
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20 }}>Telefoonnummer</Text>

            <TextInput
              placeholder="+31"
              onChangeText={(phone) => this.setState({ phone })}
              value={this.state.phone}
              style={{ backgroundColor: "white", fontSize: 20, minWidth: 150 }}
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
              theme={this.props.screenProps.device.theme}
              title="Opslaan"
              onPress={() => this.save()}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
