import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";

import T from "../components/T";
import Button from "../components/Button";
import Constants from "../Constants";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

class MyProfile extends React.Component {
  state = {
    backfire: this.props.screenProps.me?.backfire,
  };
  render() {
    const { device, me, reloadMe } = this.props.screenProps;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <T>
          Met backfire schiet je een zeker % van je kogels terug als iemand je
          aanvalt, maar nooit meer dan 2x de kogels van de aanvaller. Je hebt nu
          {me?.backfire * 100}% backfie
        </T>

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
                <T>Zet op {bf * 100}% backfire</T>
              </View>
            </TouchableOpacity>
          );
        })}
        <Button
          title="Opslaan"
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
                alert("Er ging iets mis");
              });
          }}
        />
      </View>
    );
  }
}

export default MyProfile;
