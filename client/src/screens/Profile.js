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
import {
  get,
  getRank,
  getStrength,
  getTextFunction,
  getUserColor,
} from "../Util";

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
    const {
      navigation,
      screenProps: {
        me,
        device: { theme, loginToken },
      },
    } = this.props;
    const { profile, loading, images } = this.state;

    const getText = getTextFunction(me?.locale);

    if (loading) {
      return <ActivityIndicator />;
    }

    if (!profile) {
      return <T>{getText("personDoesntExist")}</T>;
    }

    const isOnline = Date.now() - profile?.onlineAt < 300000;

    const points = profile.accomplices?.reduce(
      (total, accomplice) => total + accomplice.rank,
      0
    );

    const color = getUserColor(profile, this.props.screenProps.device.theme);

    const uri = Constants.SERVER_ADDR + "/" + images?.[0]?.image;
    const hasImage = !!images?.[0]?.image;

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

            {hasImage ? (
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
            ) : null}

            {this.keyValue(getText("online"), isOnline ? "✅" : "🛑")}
            {this.keyValue(getText("cash"), `€${profile?.cash}`)}
            {this.keyValue(getText("bank"), `€${profile?.bank}`)}
            {this.keyValue(getText("rank"), getRank(profile?.rank, "both"))}
            {this.keyValue(
              getText("strength"),
              getStrength(profile?.strength, "both")
            )}
            {this.keyValue(getText("health"), `${profile?.health}%`)}
            {this.keyValue(getText("weed"), profile?.wiet)}
            {this.keyValue(getText("junkies"), profile?.junkies)}
            {this.keyValue(getText("prostitutes"), profile?.hoeren)}

            {profile?.accomplices?.length > 0 ? (
              <>
                <T style={{ fontWeight: "bold", marginBottom: 15 }}>
                  {getText("gangOfX", profile?.name, points)}
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
                theme={theme}
                title={getText("chat")}
                onPress={async () => {
                  const { id } = await get(
                    `pm?loginToken=${loginToken}&userId=${profile.id}`
                  );

                  navigation.navigate("Channel", { id });
                }}
              />

              <Button
                theme={this.props.screenProps.device.theme}
                title={getText("rob")}
                onPress={() =>
                  navigation.navigate("Rob", {
                    name: profile.name,
                  })
                }
              />
              <Button
                theme={this.props.screenProps.device.theme}
                title={getText("attack")}
                onPress={() =>
                  navigation.navigate("Kill", {
                    name: profile.name,
                  })
                }
              />
              <Button
                theme={this.props.screenProps.device.theme}
                title={getText("donate")}
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
            {images.slice(1, images.length).map((image) => {
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
