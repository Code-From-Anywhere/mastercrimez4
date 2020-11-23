import moment from "moment";
import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import Content from "../components/Content";
import T from "../components/T";
import User from "../components/User";
import Constants from "../Constants";
import { getRank, getStrength, numberFormat } from "../Util";

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

class Status extends Component {
  state = {
    stats: [],
  };
  componentDidMount() {
    this.fetchStats();
  }

  fetchStats() {
    fetch(`${Constants.SERVER_ADDR}/stats`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((stats) => {
        this.setState({ stats });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;

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
          {this.state.stats?.map((stat, index) => {
            const key = Object.keys(stat)[0];
            const values = Object.values(stat)[0];
            return (
              <Content
                id={`stat${index}`}
                key={`stat${index}`}
                contentWidth={300}
                title={keyNames[key]}
              >
                <View
                  key={`index${index}`}
                  style={{ width: 300, marginTop: 20 }}
                >
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
                          <User
                            navigation={navigation}
                            user={value}
                            size={40}
                          />
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
      </ScrollView>
    );
  }
}

export default Status;
