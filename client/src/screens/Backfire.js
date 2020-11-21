import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { getTextFunction } from "../Util";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

class MyProfile extends React.Component {
  state = {
    backfire: this.props.screenProps.me?.backfire,
  };
  render() {
    const { device, me, reloadMe } = this.props.screenProps;

    const getText = getTextFunction(me?.locale);

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <T>{getText("backfireInfo", me?.backfire * 100)}</T>

        {[0, 0.1, 0.25, 0.5, 1].map((bf) => {
          return (
            <TouchableOpacity onPress={() => this.setState({ backfire: bf })}>
              <View
                style={{
                  padding: 10,
                  backgroundColor:
                    this.state.backfire === bf ? "blue" : undefined,
                }}
              >
                <T>{getText("backfireSetTo", bf * 100)}</T>
              </View>
            </TouchableOpacity>
          );
        })}
        <Button
          title={getText("save")}
          onPress={() => {
            fetch(`${Constants.SERVER_ADDR}/updateProfile`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                backfire: this.state.backfire,
                loginToken: device.loginToken,
              }),
            })
              .then((response) => response.json())
              .then((response) => {
                reloadMe(device.loginToken);
              })
              .catch((error) => {
                console.log("upload error", error);
                alert(getText("somethingWentWrong"));
              });
          }}
        />
      </View>
    );
  }
}

export default MyProfile;
