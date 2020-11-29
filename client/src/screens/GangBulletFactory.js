import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { AlertContext } from "../components/AlertProvider";
import Button from "../components/Button";
import Content from "../components/Content";
import T from "../components/T";
import User from "../components/User";
import { doOnce, get, getTextFunction, numberFormat, post } from "../Util";

const { height, width } = Dimensions.get("window");
const GANG_LEVEL_UNDERBOSS = 3;
const GANG_LEVEL_BANK = 2;
const GANG_LEVEL_BOSS = 4;

const SHIFT_FACTOR = 0.45;
const GangBulletFactory = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [shifts, setShifts] = useState({});
  const { morning, day, evening, night, underachievers } = shifts;

  const { showActionSheetWithOptions } = useActionSheet();

  const alertAlert = React.useContext(AlertContext);

  /*
  userDoShift,
  gangBuyBulletFactory,
  shifts,*/

  const getShifts = async () => {
    setLoading(true);

    const shifts = await get(`shifts?token=${device.loginToken}`);
    setLoading(false);
    setShifts(shifts);
  };

  const postUserDoShift = async () => {
    setLoading(true);
    const { response } = await post("userDoShift", {
      token: device.loginToken,
    });
    setLoading(false);
    setResponse(response);
    getShifts();
  };

  const postGangBuyBulletFactory = async (type) => {
    setLoading(true);
    const { response } = await post("gangBuyBulletFactory", {
      token: device.loginToken,
      type,
    });
    setLoading(false);
    setResponse(response);
    reloadMe(device.loginToken); //reload gang
  };

  doOnce(getShifts);

  const changeRank = (userId) => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [
      getText("gangLevelMember"),
      getText("gangLevelBank"),
      getText("gangLevelUnderboss"),
      getText("gangLevelBoss"),
    ];
    options.push(getText("cancel"));
    const destructiveButtonIndex = undefined;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex < 4) {
          postGangSetRank(userId, buttonIndex + 1);
        }
        // Do something here depending on the button index selected
      }
    );
  };

  const bulletFactories = [
    {
      type: "small",
      generates: 10000,
      initialCost: 10000000,
      dailyCost: 1000000,
    },
    {
      type: "medium",
      generates: 20000,
      initialCost: 100000000,
      dailyCost: 10000000,
    },
    {
      type: "big",
      generates: 40000,
      initialCost: 1000000000,
      dailyCost: 100000000,
    },
    {
      type: "mega",
      generates: 60000,
      initialCost: 10000000000,
      dailyCost: 1000000000,
    },
  ];

  const renderShiftUser = (user) => {
    return <User size={40} navigation={navigation} user={user} />;
  };

  const renderUnderAchieverUserRow = (user) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <User size={40} navigation={navigation} user={user} />
        <T>
          {user.totalShiftsDone} {getText("shiftsDone")}
        </T>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        {loading && <ActivityIndicator />}
        {response && <T>{response}</T>}
      </View>
      <ScrollView
        contentContainerStyle={{
          height: Platform.OS === "web" ? height : undefined,
        }}
        style={{ flex: 1, padding: 15 }}
      >
        <Content
          title={getText("workForBulletFactoryTitle")}
          contentWidth={"90%"}
          id="userDoShift"
        >
          <Button
            onPress={postUserDoShift}
            title={getText("workForBulletFactory")}
          />
        </Content>
        {!me?.gang?.id ? (
          <T>{getText("noAccess")}</T>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Content
              title={getText("shiftSchedule")}
              contentWidth={"90%"}
              id="shifts"
            >
              <T>
                {getText(
                  "shiftToDo",
                  me?.gang?.members,
                  Math.ceil(me?.gang?.members * SHIFT_FACTOR)
                )}
              </T>
              <T bold style={{ marginTop: 20 }}>
                {getText("morningShift")}
              </T>
              {morning?.map(renderShiftUser)}
              <T bold style={{ marginTop: 20 }}>
                {getText("dayShift")}
              </T>
              {day?.map(renderShiftUser)}
              <T bold style={{ marginTop: 20 }}>
                {getText("eveningShift")}
              </T>
              {evening?.map(renderShiftUser)}
              <T bold style={{ marginTop: 20 }}>
                {getText("nightShift")}
              </T>
              {night?.map(renderShiftUser)}
              <T bold style={{ marginTop: 20 }}>
                {getText("underachievers")}
              </T>
              {underachievers?.map(renderUnderAchieverUserRow)}
            </Content>

            {me?.gangLevel === GANG_LEVEL_BANK ||
              (me?.gangLevel === GANG_LEVEL_BOSS && (
                <Content
                  title={getText("buyBulletFactory")}
                  contentWidth={"90%"}
                  id="buyBulletFactory"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginTop: 20,
                    }}
                  >
                    {bulletFactories.map((bf) => {
                      return (
                        <View style={{ width: 200, marginHorizontal: 10 }}>
                          <T bold>{getText(`bf${bf.type}`)}</T>
                          <T>{getText("generatesBullets", bf.generates)}</T>
                          <T>
                            {getText("initialCost")}: €
                            {numberFormat(bf.initialCost)},-
                          </T>
                          <T>
                            {getText("dailyCost")}: €
                            {numberFormat(bf.dailyCost)}
                            ,-
                          </T>
                          {me?.gang?.bulletFactory === bf.type ? (
                            <T bold>{getText("currentBulletFactory")}</T>
                          ) : (
                            <Button
                              title={getText("buy")}
                              onPress={() => postGangBuyBulletFactory(bf.type)}
                            />
                          )}
                        </View>
                      );
                    })}
                  </View>
                </Content>
              ))}

            <Content
              contentWidth={"90%"}
              id="gangbulletfacotryinfo"
              title={getText("info")}
            >
              <Markdown style={{ text: { color: theme.primaryText } }}>
                {getText("gangBulletFactoryInfo")}
              </Markdown>
            </Content>

            <View style={{ height: 80 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default GangBulletFactory;
