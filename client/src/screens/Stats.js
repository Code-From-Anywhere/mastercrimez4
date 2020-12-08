import moment from "moment";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AlertContext } from "../components/AlertProvider";
import Content from "../components/Content";
import H1 from "../components/H1";
import T from "../components/T";
import User from "../components/User";
import Constants from "../Constants";
import { doOnce, get, getRank, getStrength, numberFormat } from "../Util";
const keyNames = {
  createdAt: "Nieuwe leden",
  bank: "Bankgeld",
  hoeren: "Hoeren",
  junkies: "Junkies",
  wiet: "Wiet",
  rank: "Rang",
  strength: "Moordrang",
  gamepoints: "Gamepoints",
  newMembers: "Nieuwe leden vandaag",
  onlineToday: "Leden online vandaag",
};

const Stats = ({ navigation, screenProps: { me } }) => {
  const [stats, setStats] = useState([]);
  const [gameStats, setGameStats] = useState([]);

  const alertAlert = React.useContext(AlertContext);
  const fetchStats = () => {
    fetch(`${Constants.SERVER_ADDR}/stats`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((stats) => {
        setStats(stats);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchGameStats = async () => {
    const { stats } = await get("gamestats");
    setGameStats(stats);
  };

  doOnce(fetchStats);
  doOnce(fetchGameStats);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: 20,
        }}
      >
        {stats?.map((stat, index) => {
          const key = Object.keys(stat)[0];
          const values = Object.values(stat)[0];
          return (
            <Content
              id={`stat${index}`}
              key={`stat${index}`}
              contentWidth={300}
              title={keyNames[key]}
            >
              <View key={`index${index}`} style={{ width: 300, marginTop: 20 }}>
                {values instanceof Array ? (
                  values.map((value, i) => {
                    let v = value[key];
                    if (key === "bank") v = `€${numberFormat(v)},-`;
                    if (key === "createdAt")
                      v = moment(v).format("DD-MM-YYYY HH:mm");
                    if (key === "strength") v = getStrength(v, "both");
                    if (key === "rank") v = getRank(v, "both");

                    return (
                      <View
                        key={`stat${key}-${i}`}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 5,
                        }}
                      >
                        <User navigation={navigation} user={value} size={40} />
                        <View>
                          <T key={`stat${key}-${i}`}>{v}</T>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <T>{values}</T>
                )}
              </View>
            </Content>
          );
        })}
      </View>
      {gameStats.length > 0 && (
        <View>
          <H1>Online</H1>
          <T>
            Rood is online, groen is online per uur, blauw is online per dag.
          </T>
          <ScrollView horizontal snapToEnd>
            <LineChart
              fromZero
              data={{
                labels: gameStats.map((x, index) =>
                  index === 0 || index % 6 === 0
                    ? moment(x.createdAt).format("D MMM HH:00")
                    : " "
                ),
                datasets: [
                  {
                    data: gameStats.map((x) => x.online),
                    color: (opacity) => "red",
                  },
                  {
                    data: gameStats.map((x) => x.onlineLastHour),
                    color: (opacity) => "green",
                  },
                  {
                    data: gameStats.map((x) => x.onlineLastDay),
                    color: (opacity) => "blue",
                  },
                ],
              }}
              onDataPointClick={(data) => {
                const item = gameStats[data.index];

                alertAlert(
                  moment(item.createdAt).format("D MMM HH:00"),
                  `${item.online} online, ${item.onlineLastHour} online dat uur, ${item.onlineLastDay} online die dag`,
                  null,
                  { key: "onlineInfo" }
                );
              }}
              width={gameStats.length * 20 + 100} // from react-native
              height={225}
              xAxisLabel=""
              xLabelsOffset={10}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

export default Stats;
