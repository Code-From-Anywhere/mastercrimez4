import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import {
  doOnce,
  get,
  getTextFunction,
  getUserColor,
  numberFormat,
  post,
} from "../Util";

const { width } = Dimensions.get("window");
const SIZE = 300;
const MARGIN = 10;
const Gangs = ({
  navigation,
  screenProps: {
    device,
    me,
    cities,
    reloadMe,
    reloadCities,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({});
  const [response, setResponse] = useState(null);

  const name = navigation.state.params?.name;

  const getGang = async () => {
    setLoading(true);

    const gang = await get(`gang?name=${name}`);
    setLoading(false);
    setItem(gang);
  };

  const postGangJoin = async () => {
    setLoading(true);

    const { response } = await post(`gangJoin`, {
      token: device.loginToken,
      name,
    });
    setLoading(false);
    setResponse(response);
  };

  doOnce(getGang);

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <View style={{ margin: MARGIN, flexDirection: "row", flexWrap: "wrap" }}>
        <View>
          {item.image ? (
            <Image
              source={{ uri: Constants.SERVER_ADDR + item.image }}
              style={{ width: SIZE, height: SIZE }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../../assets/icon.png")}
              style={{ width: SIZE, height: SIZE }}
            />
          )}
        </View>
        <View style={{ margin: MARGIN }}>
          {loading ? <ActivityIndicator /> : null}
          <T>
            {getText("name")}: {item.name}
          </T>
          <T>
            {getText("members")}: {item.members}
          </T>
          <T>
            {getText("bank")}: €{numberFormat(item.bank)},-
          </T>
          <T>
            {getText("power")}: {item.score}
          </T>
          {!me?.gang &&
            (response ? (
              <T>{response}</T>
            ) : (
              <Button
                onPress={postGangJoin}
                title={getText("gangJoinCTA")}
                theme={theme}
              />
            ))}
        </View>
      </View>

      <FlatList
        data={item.users}
        keyExtractor={(item, index) => `item${index}`}
        renderItem={({ item, index }) => {
          const isOnline = (Date.now() - item.onlineAt) / 60000 < 5;

          const color = getUserColor(item, theme);

          return (
            <View
              key={`item${index}`}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: 40,
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Profile", { name: item.name });
                }}
              >
                <T style={{ color }}>{item.name}</T>
              </TouchableOpacity>
              <T>{isOnline ? "✅" : "🛑"}</T>
              <T>❤️ {item.health}%</T>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Gangs;
