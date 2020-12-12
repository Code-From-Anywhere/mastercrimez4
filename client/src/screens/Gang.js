import React, { useCallback, useMemo, useState } from "react";
import isEqual from "react-fast-compare";
import { ActivityIndicator, FlatList, Image, View } from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import MarkdownView from "react-native-markdown-display";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import T from "../components/T";
import User from "../components/User";
import Constants from "../Constants";
import { doOnce, get, getTextFunction, numberFormat, post } from "../Util";

const GANG_LEVEL_UNDERBOSS = 3;
const GANG_LEVEL_BANK = 2;
const GANG_LEVEL_BOSS = 4;

const SIZE = 300;
const MARGIN = 10;

const Footer = React.memo(({ profile }) => {
  const theme = useSelector((state) => state.device.theme);
  return (
    <MarkdownView style={{ text: { color: theme.primaryText } }}>
      {profile}
    </MarkdownView>
  );
});

const getGangLevel = (gangLevel, getText) =>
  getText(
    gangLevel === GANG_LEVEL_BOSS
      ? "gangLevelBoss"
      : gangLevel === GANG_LEVEL_UNDERBOSS
      ? "gangLevelUnderboss"
      : gangLevel === GANG_LEVEL_BANK
      ? "gangLevelBank"
      : "gangLevelMember"
  );

const GangMember = React.memo(
  function GangMemberPure({ item, index, navigation, getText }) {
    return (
      <Grid key={`item${index}`}>
        <Col size={2} style={{ marginVertical: 5 }}>
          <User navigation={navigation} user={item} />
        </Col>
        <Col style={{ justifyContent: "center" }}>
          <T>{getGangLevel(item.gangLevel, getText)}</T>
        </Col>
        <Col style={{ justifyContent: "center" }}>
          <T>❤️ {item.health}%</T>
        </Col>
      </Grid>
    );
  },

  isEqual
);

const Header = React.memo(function HeaderPure({
  item,
  getText,
  postGangJoin,
  response,
  loading,
  myGangId,
}) {
  const totalHealth = item.users?.reduce((prev, user) => prev + user.health, 0);

  return (
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
        {!myGangId &&
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
},
isEqual);

// Header.whyDidYouUpdate = { logOnDifferentValues: true };

const Gang = React.memo(function GangPure({
  navigation,
  screenProps: { device, me },
}) {
  console.log("RENDER GANG");
  const getText = useMemo(() => getTextFunction(me?.locale), [me?.locale]);

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

  const postGangJoin = useCallback(async () => {
    setLoading(true);
    const { response } = await post(`gangJoin`, {
      token: device.loginToken,
      name,
    });
    setLoading(false);
    setResponse(response);
  }, [device.loginToken, name]);

  doOnce(getGang);

  const footer = () => <Footer profile={item.profile} />;

  const header = () => {
    return (
      <Header
        item={item}
        getText={getText}
        postGangJoin={postGangJoin}
        response={response}
        loading={loading}
        myGangId={me?.gangId}
      />
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <GangMember
        item={item}
        index={index}
        navigation={navigation}
        getText={getText}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListFooterComponent={footer}
        ListHeaderComponent={header}
        data={item.users}
        keyExtractor={(item, index) => `item${index}`}
        renderItem={renderItem}
      />
    </View>
  );
},
isEqual);

// Gang.whyDidYouRender = { logOnDifferentValues: true };

export default Gang;
