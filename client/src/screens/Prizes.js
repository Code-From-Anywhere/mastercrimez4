import moment from "moment";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import MarkdownView from "react-native-markdown-renderer";
import Content from "../components/Content";
import Gang from "../components/Gang";
import T from "../components/T";
import User from "../components/User";
import { InactiveScreens } from "../Menus";
import { doOnce, get, getRank, getStrength, getTextFunction } from "../Util";

/**
 */
const Prizes = ({
  navigation,
  screenProps: {
    me,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  const [prizes, setPrizes] = useState([]);
  const getPrizes = async () => {
    const { prizes } = await get("prizes");
    setPrizes(prizes);
  };
  doOnce(getPrizes);

  return (
    <ScrollView>
      <MarkdownView style={{ text: { color: theme.primaryText } }}>
        {moment().isAfter(InactiveScreens.PRIZES_NORMAL_RELEASE_DATE) &&
          moment().isBefore(InactiveScreens.PRIZES_RELEASE_DATE) &&
          getText("prizesText")}
      </MarkdownView>

      {me?.level > 1 ||
      moment().isAfter(InactiveScreens.PRIZES_RELEASE_DATE) ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {prizes.map((prize, index) => {
            const when =
              prize.every === "hour"
                ? getText("everyHour")
                : prize.every === "day"
                ? getText("everyDay5pm")
                : prize.every === "week"
                ? getText("everyWeekSunday5pm")
                : prize.every === "month"
                ? moment().endOf("month").format("DD-MM-YYYY HH:mm")
                : null;
            return (
              <Content
                contentWidth={"90%"}
                id={`prize${index}`}
                title={getText(`prize${prize.forWhat}title`) + " " + when}
              >
                {prize.stats.map((stat) => {
                  //stat is user
                  return (
                    <Grid>
                      <Col
                        size={2}
                        style={{ justifyContent: "center", paddingTop: 10 }}
                      >
                        {prize.forWhat === "gang" ? (
                          <Gang size={40} navigation={navigation} gang={stat} />
                        ) : (
                          <User size={40} navigation={navigation} user={stat} />
                        )}
                      </Col>

                      <Col style={{ justifyContent: "center", paddingTop: 10 }}>
                        <T>
                          {stat.prize} {getText(prize.prizeWhat)}
                        </T>
                      </Col>

                      {prize.forWhat === "gang" ? null : (
                        <Col
                          style={{ justifyContent: "center", paddingTop: 10 }}
                        >
                          <T>
                            {prize.forWhat === "rank"
                              ? getRank(stat[prize.forWhat], "both")
                              : prize.forWhat === "strength"
                              ? getStrength(stat[prize.forWhat], "both")
                              : `${stat[prize.forWhat]} ${getText(
                                  prize.forWhat
                                )}`}
                          </T>
                        </Col>
                      )}
                    </Grid>
                  );
                })}
              </Content>
            );
          })}
        </View>
      ) : null}
    </ScrollView>
  );
};
export default Prizes;
