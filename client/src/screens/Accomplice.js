import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  TextInput,
} from "react-native";

import T from "../components/T";
import Button from "../components/Button";
import Constants from "../Constants";
import styles from "../Style";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

class Accomplice extends React.Component {
  state = {
    accomplice: this.props.screenProps.me?.accomplice,
  };
  render() {
    const { device, me, reloadMe } = this.props.screenProps;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <T>
          Wiens handlanger wil je zijn? Vul hieronder de naam in van de gangster
          wiens handlanger jij wilt zijn, en hij zal bij alles wat hij doet hulp
          van je krijgen als jullie beide online zijn.
        </T>

        <T>Jij bent handlanger van: {me?.accomplice || "(Niemand)"}</T>

        <TextInput
          style={styles.textInput}
          value={this.state.accomplice}
          onChangeText={(accomplice) => this.setState({ accomplice })}
          placeholder={"Handlanger"}
        />
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
                accomplice: this.state.accomplice,
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

export default Accomplice;
