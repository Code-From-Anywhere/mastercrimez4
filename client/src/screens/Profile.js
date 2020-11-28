import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MarkdownView from "react-native-markdown-renderer";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import {
  doOnce,
  get,
  getRank,
  getStrength,
  getTextFunction,
  getUserColor,
} from "../Util";

const ProfileScreen = ({
  navigation,
  navigation: {
    state: { params },
  },
  screenProps: {
    device,
    me,
    cities,
    reloadCities,
    device: { theme, loginToken },
  },
}) => {
  const [profile, setProfile] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const name = params?.name;

  doOnce(() => {
    getProfile(name);
  });
  doOnce(reloadCities);

  useEffect(() => {
    getProfile(name);
  }, [params?.name]);

  useEffect(() => {
    fetchImages();
  }, [profile?.id]);

  const getProfile = (name) => {
    setLoading(true);
    return fetch(`${Constants.SERVER_ADDR}/profile?name=${name}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        setProfile(responseJson);
        setLoading(false);
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const keyValue = (key, value) => {
    return (
      <View style={styles.row}>
        <T>{key}</T>
        <T>{value}</T>
      </View>
    );
  };

  const fetchImages = () => {
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
        setImages(images);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getText = getTextFunction(me?.locale);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!profile) {
    return <T>{getText("personDoesntExist")}</T>;
  }

  const isOnline = Date.now() - profile?.onlineAt < 300000;

  const color = getUserColor(profile, device.theme);

  const uri = Constants.SERVER_ADDR + profile?.image;
  const hasImage = !!profile?.image;

  const properties = [
    {
      name: "bulletFactory",
    },
    {
      name: "casino",
    },
    {
      name: "rld",
    },
    {
      name: "landlord",
    },
    {
      name: "junkies",
    },
    {
      name: "weaponShop",
    },
    {
      name: "airport",
    },
    {
      name: "estateAgent",
    },
    {
      name: "garage",
    },
    {
      name: "jail",
    },
    {
      name: "bank",
    },
  ];
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

          {profile?.gang ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Gang", { name: profile?.gang?.name });
              }}
            >
              <T>Gang</T>
              {profile?.gang?.image && (
                <Image
                  source={{ uri: Constants.SERVER_ADDR + profile?.gang?.image }}
                  style={{ width: 200, height: 200 }}
                  resizeMode="contain"
                />
              )}
              <T>{profile?.gang?.name}</T>
            </TouchableOpacity>
          ) : null}

          {keyValue(getText("online"), isOnline ? "✅" : "🛑")}
          {keyValue(
            getText("lastOnline"),
            moment(profile?.onlineAt).format("DD-MM-YYYY")
          )}
          {keyValue(getText("cash"), `€${profile?.cash}`)}
          {keyValue(getText("bank"), `€${profile?.bank}`)}
          {keyValue(getText("rank"), getRank(profile?.rank, "both"))}
          {keyValue(
            getText("strength"),
            getStrength(profile?.strength, "both")
          )}
          {keyValue(getText("health"), `${profile?.health}%`)}
          {keyValue(getText("weed"), profile?.wiet)}
          {keyValue(getText("junkies"), profile?.junkies)}
          {keyValue(getText("prostitutes"), profile?.hoeren)}

          <T bold>{getText("properties")}</T>
          {properties
            .map((p) => p.name)
            .map((property) => {
              return (
                cities &&
                cities.map((city, index) => {
                  const ownerKey = `${property}Owner`;
                  if (profile?.name === city[ownerKey]) {
                    return (
                      <T>
                        {getText(property)} in {city.city}
                      </T>
                    );
                  }

                  return null;
                })
              );
            })}

          <View style={styles.row}>
            <Button
              title={getText("chat")}
              onPress={async () => {
                const { id } = await get(
                  `pm?loginToken=${loginToken}&userId=${profile.id}`
                );

                navigation.navigate("Channel", { id });
              }}
            />

            <Button
              title={getText("rob")}
              onPress={() =>
                navigation.navigate("Rob", {
                  name: profile.name,
                })
              }
            />
            <Button
              title={getText("attack")}
              onPress={() =>
                navigation.navigate("Kill", {
                  name: profile.name,
                })
              }
            />
            <Button
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
          <MarkdownView style={{ text: { color: theme.primaryText } }}>
            {profile?.bio}
          </MarkdownView>
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
};

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
