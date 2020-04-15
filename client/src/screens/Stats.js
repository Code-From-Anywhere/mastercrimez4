import React, { Component } from "react";
import { Text, View } from "react-native";
import Constants from "../Constants";
import T from "../components/T";
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
      <View style={{ flex: 1, jusitfyContent: "center", alignItems: "center" }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {this.state.stats?.map((stat, index) => {
            const key = Object.keys(stat)[0];
            const values = Object.values(stat)[0];
            return (
              <View key={`index${index}`} style={{ width: 300, margin: 20 }}>
                <T style={{ fontWeight: "bold" }}>{keyNames[key]}</T>
                {values instanceof Array ? (
                  values.map((value, i) => {
                    return (
                      <T key={`stat${key}-${i}`}>
                        {value.name}: {value[key]}
                      </T>
                    );
                  })
                ) : (
                  <T>{values}</T>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default Status;
