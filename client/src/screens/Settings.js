import React, { Component } from "react";
import { View } from "react-native";
import Menu from "../components/Menu";

class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

    return (
      <View>
        <Menu
          navigation={navigation}
          title="Telefoonnummer verifiëren"
          to="VerifyPhone"
        />
        <Menu
          navigation={navigation}
          title="Wachtwoord veranderen"
          to="ChangePassword"
        />
        <Menu
          navigation={navigation}
          title="Email veranderen"
          to="SignupEmail"
        />
        <Menu navigation={navigation} title="Naam veranderen" to="ChangeName" />
        <Menu
          navigation={navigation}
          title="Login op ander account"
          to="Login"
        />
        <Menu
          navigation={navigation}
          title="Mijn profiel aanpassen"
          to="MyProfile"
        />
        <Menu
          navigation={navigation}
          title="Backfire aanpassen"
          to="Backfire"
        />
        <Menu navigation={navigation} title="Handlanger" to="Accomplice" />
      </View>
    );
  }
}

export default Status;
