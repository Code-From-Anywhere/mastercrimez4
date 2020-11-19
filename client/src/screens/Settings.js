import React, { Component } from "react";
import { ScrollView } from "react-native";
import Menu from "../components/Menu";
import { areYouSure, getTextFunction } from "../Util";

class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: {
        dispatch,
        me,
        device: { theme },
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <ScrollView>
        {/* {Platform.OS !== "web" && (
          <Menu
            theme={theme}
            theme={theme}
            IconFont="Ionicons"
            icon="ios-notifications"
            navigation={navigation}
            title="Notificaties"
            to="Notifications"
          />
        )} */}

        {__DEV__ && (
          <Menu
            theme={theme}
            theme={theme}
            IconFont="Ionicons"
            icon="ios-notifications"
            navigation={navigation}
            title={getText("purge")}
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
          title={getText("verifyPhone")}
          to="VerifyPhone"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("menuChangePassword")}
          to="ChangePassword"
          IconFont="MaterialCommunityIcons"
          icon="onepassword"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("signupEmail")}
          to="SignupEmail"
          IconFont="Entypo"
          icon="email"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("changeName")}
          to="ChangeName"
          IconFont="FontAwesome"
          icon="bank"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("layout")}
          to="Theme"
          IconFont="Ionicons"
          icon="ios-color-palette"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("menuLogin")}
          to="Login"
          IconFont="Entypo"
          icon="login"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("menuMyProfile")}
          to="MyProfile"
          IconFont="AntDesign"
          icon="user"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("menuBackfire")}
          to="Backfire"
          IconFont="MaterialCommunityIcons"
          icon="pistol"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("menuAccomplice")}
          to="Accomplice"
          IconFont="FontAwesome"
          icon="universal-access"
        />
      </ScrollView>
    );
  }
}

export default Status;
