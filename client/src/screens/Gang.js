import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  View,
} from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import MarkdownView from "react-native-markdown-display";
import Button from "../components/Button";
import T from "../components/T";
import User from "../components/User";
import Constants from "../Constants";
import {
  doOnce,
  get,
  getTextFunction,
  getUserColor,
  numberFormat,
  post,
} from "../Util";

const GANG_LEVEL_UNDERBOSS = 3;
const GANG_LEVEL_BANK = 2;
const GANG_LEVEL_BOSS = 4;

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

  const getGangLevel = (gangLevel) =>
    getText(
      gangLevel === GANG_LEVEL_BOSS
        ? "gangLevelBoss"
        : gangLevel === GANG_LEVEL_UNDERBOSS
        ? "gangLevelUnderboss"
        : gangLevel === GANG_LEVEL_BANK
        ? "gangLevelBank"
        : "gangLevelMember"
    );

  const totalHealth = item.users?.reduce((prev, user) => prev + user.health, 0);

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <FlatList
        ListFooterComponent={() => {
          return (
            <MarkdownView style={{ text: { color: theme.primaryText } }}>
              {item?.profile}
            </MarkdownView>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View
              style={{ margin: MARGIN, flexDirection: "row", flexWrap: "wrap" }}
            >
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

                {totalHealth === 0 ? (
                  <Image
                    source={require("../../assets/uitgemoord.jpg")}
                    style={{ width: SIZE, height: SIZE }}
                  />
                ) : null}
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
          );
        }}
        data={item.users}
        keyExtractor={(item, index) => `item${index}`}
        renderItem={({ item, index }) => {
          const isOnline = (Date.now() - item.onlineAt) / 60000 < 5;

          const color = getUserColor(item, theme);

          return (
            <Grid
              key={`item${index}`}
              style={{
                paddingHorizontal: 20,
              }}
            >
              <Col style={{ marginVertical: 5 }}>
                <User navigation={navigation} user={item} />
              </Col>
              <Col style={{ justifyContent: "center" }}>
                <T>{getGangLevel(item.gangLevel)}</T>
              </Col>
              <Col style={{ justifyContent: "center" }}>
                <T>❤️ {item.health}%</T>
              </Col>
            </Grid>
          );
        }}
      />
    </View>
  );
};

export default Gangs;
