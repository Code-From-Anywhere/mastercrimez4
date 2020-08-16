import React, { Component } from "react";
import { Platform, ScrollView } from "react-native";
import Menu from "../components/Menu";
import { areYouSure } from "../Util";

class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;

    return (
      <ScrollView>
        {Platform.OS !== "web" && (
          <Menu
            theme={theme}
            theme={theme}
            IconFont="Ionicons"
            icon="ios-notifications"
            navigation={navigation}
            title="Notificaties"
            to="Notifications"
          />
        )}

        {__DEV__ && (
          <Menu
            theme={theme}
            theme={theme}
            IconFont="Ionicons"
            icon="ios-notifications"
            navigation={navigation}
            title="Purge"
            onPress={() =>
              areYouSure(() => {
                dispatch({ type: "PURGE" });
              })
            }
          />
        )}

        <Menu
          theme={theme}
          IconFont="Entypo"
          icon="phone"
          navigation={navigation}
          title="Telefoonnummer verifiëren"
          to="VerifyPhone"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Wachtwoord veranderen"
          to="ChangePassword"
          IconFont="MaterialCommunityIcons"
          icon="onepassword"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Email veranderen"
          to="SignupEmail"
          IconFont="Entypo"
          icon="email"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Naam veranderen"
          to="ChangeName"
          IconFont="FontAwesome"
          icon="bank"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Layout"
          to="Theme"
          IconFont="Ionicons"
          icon="ios-color-palette"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Login op ander account"
          to="Login"
          IconFont="Entypo"
          icon="login"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Mijn profiel aanpassen"
          to="MyProfile"
          IconFont="AntDesign"
          icon="user"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Backfire"
          to="Backfire"
          IconFont="MaterialCommunityIcons"
          icon="pistol"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Handlanger"
          to="Accomplice"
          IconFont="FontAwesome"
          icon="universal-access"
        />
      </ScrollView>
    );
  }
}

export default Status;
