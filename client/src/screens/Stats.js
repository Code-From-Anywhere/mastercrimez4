import moment from "moment";
import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import T from "../components/T";
import Constants from "../Constants";
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
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {this.state.stats?.map((stat, index) => {
            const key = Object.keys(stat)[0];
            const values = Object.values(stat)[0];
            return (
              <View key={`index${index}`} style={{ width: 300, margin: 20 }}>
                <T style={{ fontWeight: "bold" }}>{keyNames[key]}</T>
                {values instanceof Array ? (
                  values.map((value, i) => {
                    let v = value[key];
                    if (key === "bank") v = `€${v},-`;
                    if (key === "createdAt")
                      v = moment(v).format("DD-MM-YYYY HH:mm");
                    return (
                      <View
                        key={`stat${key}-${i}`}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <T>{value.name}: </T>
                        <T key={`stat${key}-${i}`}>{v}</T>
                      </View>
                    );
                  })
                ) : (
                  <T>{values}</T>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

export default Status;
