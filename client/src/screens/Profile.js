import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { getRank, getStrength, getUserColor } from "../Util";

class ProfileScreen extends React.Component {
  state = {
    profile: null,
    images: [],
    loading: true,
  };
  componentDidMount() {
    const { navigation } = this.props;

    const name = navigation.state.params.name;

    this.getProfile(name);
  }

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;

    const name = navigation.state.params.name;

    if (
      prevProps.navigation.state.params !== this.props.navigation.state.params
    ) {
      this.getProfile(name);
    }
  }

  getProfile(name) {
    return fetch(`${Constants.SERVER_ADDR}/profile?name=${name}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({ profile: responseJson, loading: false }, () => {
          this.fetchImages();
        });
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  keyValue(key, value) {
    return (
      <View style={styles.row}>
        <T>{key}</T>
        <T>{value}</T>
      </View>
    );
  }

  fetchImages = () => {
    const { device } = this.props.screenProps;
    const { profile } = this.state;
    fetch(
      `${Constants.SERVER_ADDR}/listimages?token=${device.loginToken}&uid=${profile?.id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then(({ images }) => {
        this.setState({ images });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    const { navigation } = this.props;
    const { profile, loading, images } = this.state;

    if (loading) {
      return <ActivityIndicator />;
    }

    if (!profile) {
      return <T>Deze persoon bestaat niet</T>;
    }

    const isOnline = Date.now() - profile?.onlineAt < 300000;

    const points = profile.accomplices?.reduce(
      (total, accomplice) => total + accomplice.rank,
      0
    );

    const color = getUserColor(profile, this.props.screenProps.device.theme);

    return (
      <ScrollView>
        <View style={{ justifyContent: "center" }}>
          <View
            style={{
              backgroundColor: "#444",
              borderRadius: 10,
              margin: 20,
              padding: 20,
            }}
          >
            <Text style={{ fontWeight: "bold", color }}>{profile?.name}</Text>

            {this.keyValue("Online", isOnline ? "✅" : "🛑")}
            {this.keyValue("Contant", `€${profile?.cash}`)}
            {this.keyValue("Bank", `€${profile?.bank}`)}
            {this.keyValue("Rank", getRank(profile?.rank, "both"))}
            {this.keyValue("Moordrang", getStrength(profile?.strength, "both"))}
            {this.keyValue("Leven", `${profile?.health}%`)}
            {this.keyValue("Wiet", profile?.wiet)}
            {this.keyValue("Junkies", profile?.junkies)}
            {this.keyValue("Hoeren", profile?.hoeren)}

            {profile?.accomplices?.length > 0 ? (
              <>
                <T style={{ fontWeight: "bold", marginBottom: 15 }}>
                  Gang van {profile?.name}: {points} punten
                </T>
                {profile.accomplices.map((accomplice) => {
                  return this.keyValue(
                    accomplice.name,
                    getRank(accomplice.rank, "both")
                  );
                })}
              </>
            ) : null}
            <View style={styles.row}>
              <Button
                theme={this.props.screenProps.device.theme}
                title="Stuur bericht"
                onPress={() =>
                  navigation.navigate("Messages", {
                    state: { to: profile.name, newMessage: true },
                  })
                }
              />
              <Button
                theme={this.props.screenProps.device.theme}
                title="Beroof"
                onPress={() =>
                  navigation.navigate("Rob", {
                    name: profile.name,
                  })
                }
              />
              <Button
                theme={this.props.screenProps.device.theme}
                title="Aanvallen"
                onPress={() =>
                  navigation.navigate("Kill", {
                    name: profile.name,
                  })
                }
              />
              <Button
                theme={this.props.screenProps.device.theme}
                title="Doneren"
                onPress={() =>
                  navigation.navigate("Donate", {
                    to: profile.name,
                  })
                }
              />
            </View>
          </View>

          <View style={{ marginVertical: 20 }}>
            <T>{profile?.bio}</T>
          </View>

          <View>
            {images.map((image) => {
              const uri = Constants.SERVER_ADDR + "/" + image.image;
              return (
                <View>
                  <Image
                    source={{ uri }}
                    style={{
                      width: "100%",
                      height: 400,
                    }}
                    resizeMode="contain"
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    height: 40,
    alignItems: "center",
  },
});

export default ProfileScreen;
