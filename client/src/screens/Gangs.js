import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import { doOnce, get, getTextFunction, numberFormat, post } from "../Util";

const { width } = Dimensions.get("window");
const SIZE = 100;
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
  const [response, setResponse] = useState(null);
  const [gangs, setGangs] = useState([]);
  const [invites, setInvites] = useState([]);

  const getGangs = async () => {
    setLoading(true);
    const { gangs } = await get("gangs");
    setLoading(false);
    setGangs(gangs);
  };

  const getInvites = async () => {
    const { requests, invites } = await get(
      `gangInvites?token=${device.loginToken}`
    );
    setInvites(invites);
  };

  const postGangAnswerInvite = async (id, accepted) => {
    const { response } = await post("gangAnswerInvite", {
      token: device.loginToken,
      id,
      accepted,
    });
    setResponse(response);
  };

  doOnce(getGangs);
  doOnce(getInvites);

  return (
    <View style={{ flex: 1, padding: 15 }}>
      {response && <T>{response}</T>}
      {invites.length > 0 &&
        invites.map((invite, index) => {
          return (
            <View key={`invite${index}`} style={{ flexDirection: "row" }}>
              <T>{getText("gangInvitedTo", invite.gangName)}</T>
              <Button
                title={getText("accept")}
                onPress={() => postGangAnswerInvite(invite.id, true)}
              />
              <Button
                title={getText("decline")}
                onPress={() => postGangAnswerInvite(invite.id, false)}
              />
            </View>
          );
        })}

      <FlatList
        refreshing={loading}
        onRefresh={getGangs}
        data={gangs}
        numColumns={
          Platform.OS === "web"
            ? undefined
            : Math.floor(width / (SIZE + MARGIN * 2))
        }
        contentContainerStyle={
          Platform.OS === "web"
            ? { flexDirection: "row", flexWrap: "wrap" }
            : undefined
        }
        keyExtractor={(item, index) => `gang${index}`}
        renderItem={({ item, index }) => {
          const navigate = () =>
            navigation.navigate("Gang", { name: item.name });
          return (
            <TouchableOpacity onPress={navigate} style={{ margin: MARGIN }}>
              {item.thumbnail ? (
                <Image
                  source={{ uri: Constants.SERVER_ADDR + item.thumbnail }}
                  style={{ width: SIZE, height: SIZE }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require("../../assets/icon.png")}
                  style={{ width: SIZE, height: SIZE }}
                />
              )}
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
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Gangs;
