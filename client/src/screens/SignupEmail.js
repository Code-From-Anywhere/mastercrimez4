import React from "react";
import { Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";
class Login extends React.Component {
  state = {
    email: "",
    error: null,
    success: null,
  };

  login() {
    const { loginToken } = this.props.screenProps.device;
    const { email, password } = this.state;
    console.log("SIgnup");
    fetch(`${Constants.SERVER_ADDR}/signupEmail`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginToken, email }),
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
    const { navigation } = this.props;
    const {
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            margin: 20,
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
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <View />

            <Button
              theme={this.props.screenProps.device.theme}
              title={getText("confirmEmail")}
              onPress={() => this.login()}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
