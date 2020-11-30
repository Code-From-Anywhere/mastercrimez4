import moment from "moment";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import CountDown from "react-native-countdown-component";
import { Col, Grid } from "react-native-easy-grid";
import Button from "../components/Button";
import H1 from "../components/H1";
import T from "../components/T";
import { doOnce, get, getTextFunction, post } from "../Util";
const GangMissions = ({ navigation, screenProps: { device, me } }) => {
  const getText = getTextFunction(me?.locale);

  const [result, setResult] = useState({ response: getText("loading") });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const postGangMissionPrestige = async () => {
    setLoading(true);
    const { response } = await post("gangMissionPrestige", {
      token: device.loginToken,
    });
    setResponse(response);
    getGangMissions();
    setLoading(false);
  };
  const postGangStartMission = async (index) => {
    setLoading(true);
    const { response } = await post("gangStartMission", {
      token: device.loginToken,
      index,
    });
    setResponse(response);
    getGangMissions();
    setLoading(false);
  };

  const getGangMissions = async () => {
    setLoading(true);
    const result = await get(`gangMissions?token=${device.loginToken}`);
    setResult(result);
    setLoading(false);
  };

  doOnce(getGangMissions);

  const isPrestige = result?.reduce?.(
    (prev, mission) => prev && !!mission.current
  );
  console.log(isPrestige);
  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {loading && <ActivityIndicator />}
      {response && <T>{response}</T>}
      {result.response ? (
        <T>{result.response}</T>
      ) : (
        <View>
          <View style={{ marginBottom: 20 }}>
            <H1>{getText("missions")}</H1>
          </View>
          {isPrestige && (
            <Button
              title={getText("youArePrestige")}
              onPress={postGangMissionPrestige}
            />
          )}
          {result?.map((mission, index) => {
            const time =
              mission.seconds < 120
                ? `${mission.seconds} ${getText("seconds")}`
                : mission.seconds < 3600
                ? `${Math.round(mission.seconds / 60)} ${getText("minutes")}`
                : `${Math.round(mission.seconds / 3600)} ${getText("hours")}`;

            const startButton = (
              <Button
                onPress={() => postGangStartMission(index)}
                title={getText("start")}
              />
            );
            return (
              <Grid style={{ height: 50 }}>
                <Col size={4}>
                  <T>
                    {getText(
                      mission.what + "Mission",
                      mission.amountPerMember * me?.gang?.members
                    )}{" "}
                    in {time}
                  </T>
                </Col>
                <Col>
                  {mission.current ? (
                    mission.current.isEnded ? (
                      mission.current.isSucceeded ? (
                        <T>✅</T>
                      ) : (
                        <View style={{ flexDirection: "row" }}>
                          <T>⛔️</T>
                        </View>
                      )
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        <T>
                          {mission.current.amountDone}/
                          {mission.amountPerMember * me?.gang?.members}
                        </T>
                      </View>
                    )
                  ) : null}
                </Col>

                <Col style={{ alignItems: "flex-end" }}>
                  {mission.current ? (
                    mission.current.isEnded ? (
                      mission.current.isSucceeded ? null : (
                        <View style={{ flexDirection: "row" }}>
                          {startButton}
                        </View>
                      )
                    ) : (
                      <CountDown
                        style={{ marginLeft: 10 }}
                        until={moment(mission.current.createdAt)
                          .add(mission.seconds, "seconds")
                          .diff(moment(), "seconds")}
                        digitStyle={{
                          backgroundColor: device.theme.secondary,
                        }}
                        digitTxtStyle={{ color: device.theme.secondaryText }}
                        onFinish={() => {}}
                        size={8}
                        timeToShow={["H", "M", "S"]}
                        timeLabels={{ m: null, s: null }}
                      />
                    )
                  ) : (
                    <View style={{ flexDirection: "row" }}>{startButton}</View>
                  )}
                </Col>
              </Grid>
            );
          })}
        </View>
      )}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default GangMissions;
