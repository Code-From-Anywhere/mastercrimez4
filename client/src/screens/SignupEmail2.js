//activated to 1 if activationtoken is correct
import React from "react";
import { View } from "react-native";
import T from "../components/T";
import Constants from "../Constants";
class Login extends React.Component {
  state = {
    respones: null,
  };

  componentDidMount() {
    this.activate();
  }

  activate() {
    const activationToken = this.props.navigation.state.params.token;

    fetch(`${Constants.SERVER_ADDR}/activate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activationToken }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ response: responseJson });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <T>{this.state?.response?.response}</T>
      </View>
    );
  }
}

export default Login;
