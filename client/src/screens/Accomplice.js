import React from "react";
import { Clipboard, Dimensions, TextInput, View } from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import styles from "../Style";
import { getRank } from "../Util";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

class Accomplice extends React.Component {
  state = {
    accomplice: this.props.screenProps.me?.accomplice,
    accomplice2: this.props.screenProps.me?.accomplice2,
    accomplice3: this.props.screenProps.me?.accomplice3,
    accomplice4: this.props.screenProps.me?.accomplice4,
    response: null,
  };

  componentDidMount() {
    const accomplice = this.props.navigation.state.params?.accomplice;
    const { me } = this.props.screenProps;

    if (accomplice && me) {
      this.setState({ accomplice }, () => {
        this.setAccomplice();
      });
    }
  }

  setAccomplice = () => {
    const { device, reloadMe } = this.props.screenProps;

    fetch(`${Constants.SERVER_ADDR}/setAccomplice`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accomplice: this.state.accomplice,
        accomplice2: this.state.accomplice2,
        accomplice3: this.state.accomplice3,
        accomplice4: this.state.accomplice4,

        loginToken: device.loginToken,
      }),
    })
      .then((response) => response.json())
      .then(({ response }) => {
        this.setState({ response });
        reloadMe(device.loginToken);
      })
      .catch((error) => {
        console.log("upload error", error);
        alert("Er ging iets mis");
      });
  };

  render() {
    const { response } = this.state;
    const { me } = this.props.screenProps;
    const rank = getRank(me?.rank, "number");
    const url = `https://mastercrimez.nl/#/Accomplice?accomplice=${me?.name}`;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ maxWidth: 600 }}>
          <T>
            Wiens handlanger wil je zijn? Vul hieronder de naam in van de
            gangster wiens handlanger jij wilt zijn, en hij zal bij alles wat
            hij doet hulp van je krijgen als jullie beide organised crime doen.
          </T>

          <View style={{ marginVertical: 20 }}>
            <T>Jij bent 1e handlanger van: {me?.accomplice || "(Niemand)"}</T>
            <T>Jij bent 2e handlanger van: {me?.accomplice2 || "(Niemand)"}</T>
            <T>Jij bent 3e handlanger van: {me?.accomplice3 || "(Niemand)"}</T>
            <T>Jij bent 4e handlanger van: {me?.accomplice4 || "(Niemand)"}</T>
          </View>
          <View style={{ marginBottom: 20 }}>
            <T>
              Deel deze link met vrienden, zodat ze jouw handlanger worden als
              ze beginnen met spelen!
            </T>
            <TextInput
              value={url}
              onFocus={() => {
                Clipboard.setString(url);
                this.setState({ response: "Gekopiëerd naar klembord" });
              }}
            />
          </View>
          <T>{response}</T>

          <TextInput
            style={styles.textInput}
            value={this.state.accomplice}
            onChangeText={(accomplice) => this.setState({ accomplice })}
            placeholder={"Handlanger"}
          />

          {rank >= 11 ? (
            <TextInput
              style={styles.textInput}
              value={this.state.accomplice2}
              onChangeText={(accomplice2) => this.setState({ accomplice2 })}
              placeholder={"Handlanger 2"}
            />
          ) : null}

          {rank >= 16 ? (
            <>
              <TextInput
                style={styles.textInput}
                value={this.state.accomplice3}
                onChangeText={(accomplice3) => this.setState({ accomplice3 })}
                placeholder={"Handlanger 3"}
              />

              <TextInput
                style={styles.textInput}
                value={this.state.accomplice4}
                onChangeText={(accomplice4) => this.setState({ accomplice4 })}
                placeholder={"Handlanger 4"}
              />
            </>
          ) : null}

          <Button title="Opslaan" onPress={this.setAccomplice} />
        </View>
      </View>
    );
  }
}

export default Accomplice;
