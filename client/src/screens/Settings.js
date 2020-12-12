import React from "react";
import { Platform, ScrollView } from "react-native";
import { AlertContext } from "../components/AlertProvider";
import Menu from "../components/Menu";
import { getTextFunction } from "../Util";

const Settings = ({
  navigation,
  screenProps: {
    dispatch,
    me,
    reloadMe,
    device,
    device: { theme },
  },
}) => {
  const alertAlert = React.useContext(AlertContext);

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
        <>
          <Menu
            theme={theme}
            IconFont="Ionicons"
            icon="ios-notifications"
            navigation={navigation}
            title={getText("purge")}
            onPress={() =>
              alertAlert(
                getText("areYouSure"),
                getText("areYouSure"),
                [
                  {
                    text: getText("ok"),
                    onPress: () => dispatch({ type: "PURGE" }),
                  },
                  {
                    text: getText("cancel"),
                  },
                ],
                { key: "purge" }
              )
            }
          />

          <Menu
            theme={theme}
            IconFont="Ionicons"
            icon="ios-notifications"
            navigation={navigation}
            title={"Reset info"}
            onPress={() =>
              alertAlert(
                getText("areYouSure"),
                getText("areYouSure"),
                [
                  {
                    text: getText("ok"),
                    onPress: () => dispatch({ type: "RESET_HAS_SEEN_INFO" }),
                  },
                  {
                    text: getText("cancel"),
                  },
                ],
                { key: "purge" }
              )
            }
          />

          <Menu
            theme={theme}
            IconFont="Ionicons"
            icon="ios-notifications"
            navigation={navigation}
            title={"Reset intro"}
            onPress={() =>
              alertAlert(
                getText("areYouSure"),
                getText("areYouSure"),
                [
                  {
                    text: getText("ok"),
                    onPress: () => dispatch({ type: "RESET_INTRO_LEVEL" }),
                  },
                  {
                    text: getText("cancel"),
                  },
                ],
                { key: "purge" }
              )
            }
          />
        </>
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
        IconFont="Entypo"
        icon="login"
        onPress={() => dispatch({ type: "SET_LOGGED", value: false })}
      />

      {Platform.OS === "web" && (
        <Menu
          theme={theme}
          navigation={navigation}
          title={device.hideMap ? getText("showMap") : getText("hideMap")}
          IconFont="Entypo"
          icon="map"
          onPress={() =>
            dispatch({ type: "SET_HIDE_MAP", value: !device.hideMap })
          }
        />
      )}

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
    </ScrollView>
  );
};

export default Settings;
