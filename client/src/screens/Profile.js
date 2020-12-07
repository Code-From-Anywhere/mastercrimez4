// import color from "markdown-it-color-text";
import center from "markdown-it-center-text";
import emoji from "markdown-it-emoji";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import { AlertContext } from "../components/AlertProvider";
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
  post,
} from "../Util";

const markdownItInstance = MarkdownIt({ typographer: true })
  // .use(taskLists)
  .use(emoji)
  .use(center);
// .use(color);

const Bio = React.memo(({ bio, theme }) => {
  return (
    <Markdown
      debugPrintTree
      markdownit={markdownItInstance}
      style={{ body: { color: theme.primaryText } }}
      rules={{
        blocklink: (node, children, parent, styles) => {
          return (
            <TouchableOpacity
              key={node.key}
              onPress={() => {
                if (Platform.OS == "web") {
                  window.open(node.attributes.href, "_blank");
                } else {
                  Linking.openURL(node.attributes.href); // normal Linking react-native
                }
              }}
            >
              {children}
            </TouchableOpacity>
          );
        },

        image: (node, children, parent, styles) => {
          const [width, setWidth] = useState(0);
          const [height, setHeight] = useState(0);
          Image.getSize(node.attributes.src, (width, height) => {
            setWidth(width);
            setHeight(height);
          });

          // examine the node properties to see what video we need to render
          // console.log(node); // expected output of this is in readme.md below this code snip

          return (
            <Image
              key={node.key}
              source={{ uri: node.attributes.src }}
              style={{ width: width, height: height }}
              resizeMode="contain"
            />
          );
        },

        emoji: (node, children, parent, styles) => {
          // examine the node properties to see what video we need to render
          // console.log(node); // expected output of this is in readme.md below this code snip

          return <Text key={node.key}>{node.content}</Text>;
        },

        centertext: (node, children, parent, styles) => {
          // examine the node properties to see what video we need to render
          // console.log(node); // expected output of this is in readme.md below this code snip

          return (
            <View
              key={node.key}
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              {children}
            </View>
          );
        },

        paragraph: (node, children, parent, styles) => {
          // examine the node properties to see what video we need to render
          // console.log(node); // expected output of this is in readme.md below this code snip

          return (
            <View key={node.key} style={{ flex: 1 }}>
              {children}
            </View>
          );
        },

        textgroup: (node, children, parent, styles) => {
          // examine the node properties to see what video we need to render
          // console.log(node); // expected output of this is in readme.md below this code snip

          return (
            <View key={node.key} style={{ flex: 1 }}>
              {children}
            </View>
          );
        },
      }}
    >
      {bio}
    </Markdown>
  );
});
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
  const [response, setResponse] = useState(null);

  const name = params?.name;
  const getText = getTextFunction(me?.locale);

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

  const postReport = async () => {
    const { response } = await post("report", {
      token: device.loginToken,
      userId: profile?.id,
      ban: "reported",
      banReason: "profile",
    });

    setResponse(response);
  };

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

  const PROFESSIONS = [
    { type: "thief", image: require("../../assets/profession/thief.jpg") },
    {
      type: "carthief",
      image: require("../../assets/profession/carthief.jpg"),
    },
    {
      type: "weedgrower",
      image: require("../../assets/profession/weedgrower.jpg"),
    },
    { type: "killer", image: require("../../assets/profession/killer.jpg") },
    { type: "pimp", image: require("../../assets/profession/pimp.jpg") },
    { type: "banker", image: require("../../assets/profession/banker.jpg") },
    {
      type: "jailbreaker",
      image: require("../../assets/profession/jailbreaker.jpg"),
    },
  ];
  const profession = profile?.profession
    ? PROFESSIONS.find((p) => p.type === profile.profession)
    : null;

  const professionReleaseDate = moment("15/03/2021", "DD/MM/YYYY").set(
    "hour",
    17
  );
  const alertAlert = React.useContext(AlertContext);

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

          {response && <T>{response}</T>}
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

          {profession && moment().isAfter(professionReleaseDate) && (
            <View style={{ width: 100, margin: 20 }}>
              <Image
                source={profession.image}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
              />
              <View>
                <T bold>{getText(profession.type)}</T>
              </View>
            </View>
          )}

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

            <Button
              title={getText("report")}
              onPress={() =>
                alertAlert(
                  getText("areYouSure"),
                  getText("areYouSure"),
                  [
                    { text: getText("ok"), onPress: () => postReport() },
                    { text: getText("cancel") },
                  ],
                  { key: "postReport" }
                )
              }
            />
          </View>
        </View>

        <View style={{ marginVertical: 20 }}>
          {profile?.ban !== "shadowBanned" && profile?.ban !== "banned" && (
            <Bio theme={theme} bio={profile?.bio} />
          )}
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
