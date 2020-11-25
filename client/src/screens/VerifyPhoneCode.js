import * as Updates from "expo-updates";
import React from "react";
import { Platform, Text, TextInput, View } from "react-native";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";

class Login extends React.Component {
  state = {
    code: "",
    error: null,
    success: null,
  };

  save() {
    const {
      navigation,
      screenProps: { dispatch, reloadMe },
    } = this.props;

    const { code } = this.state;

    fetch(`${Constants.SERVER_ADDR}/verifyPhone`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        phone: this.props.navigation.state.params?.phone,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responseJson", responseJson);

        this.setState({ response: responseJson.response });

        if (responseJson.success) {
          dispatch({ type: "SET_LOGIN_TOKEN", value: responseJson.token });

          if (Platform.OS === "web") {
            location.reload();
          } else {
            Updates.reloadAsync();
          }
          // reloadMe(responseJson.token);

          // navigation.popToTop();
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
        me,
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            flex: 1,
            margin: 20,
            padding: 20,
            borderRadius: 20,
          }}
        >
          {this.state.response ? (
            <Text style={{ color: theme.primaryText }}>
              {this.state.response}
            </Text>
          ) : null}

          <View
            style={{
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: theme.primaryText }}>{getText("code")}</Text>

            <TextInput
              placeholder="000000"
              placeholderTextColor={theme.secondaryTextSoft}
              onChangeText={(code) => this.setState({ code })}
              value={this.state.code}
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
              title={getText("validate")}
              onPress={() => this.save()}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
