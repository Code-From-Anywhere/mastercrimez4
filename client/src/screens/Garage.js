import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../components/Button";
import Separator from "../components/Separator";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";

const { width } = Dimensions.get("window");
class Garage extends Component {
  state = {
    selected: null,
    response: null,
    cars: [],
    amount: {},
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { device } = this.props.screenProps;

    this.fetchGroups();

    // this.focusListener = navigation.addListener("didFocus", () => {
    //   // The screen is focused
    //   // Call any action
    //   this.fetchGroups();
    // });
  }

  componentWillUnmount() {
    // Remove the event listener
    // this.focusListener.remove();
  }

  fetchGroups = () => {
    const { device } = this.props.screenProps;

    fetch(`${Constants.SERVER_ADDR}/garageGrouped?token=${device.loginToken}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (carGroups) => {
        const amount = carGroups.reduce(
          (previous, current) => ({
            ...previous,
            [current.id]: String(current.amount),
          }),
          {}
        );

        this.setState({
          carGroups,
          amount,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  bulkAction = (action, auto, amount) => {
    const { loginToken } = this.props.screenProps.device;
    fetch(`${Constants.SERVER_ADDR}/bulkaction`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, action, auto, loginToken }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        this.setState({ response, auto, amount: {} });
        this.props.screenProps.reloadMe(loginToken);
        this.fetchGroups();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  upgradeCar = (id) => {
    const { loginToken } = this.props.screenProps.device;
    fetch(`${Constants.SERVER_ADDR}/upgradecar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, loginToken }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        this.setState({ response, id });
        this.props.screenProps.reloadMe(loginToken);
        this.fetchGroups();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  renderGroup = ({ item, index }) => {
    const {
      screenProps: {
        device,
        device: { theme },
        me,
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);
    const value = this.state.amount[item.id];

    return (
      <View
        key={`item${index}`}
        style={{
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            width: 350,
            height: 300,
            resizeMode: "contain",
            alignSelf: "center",
          }}
          source={{ uri: Constants.SERVER_ADDR + "/" + item.image }}
        />

        <View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            <View>
              {(this.state.response && this.state.auto === item.auto) ||
              this.state.id === item.id ? (
                <Text style={{ color: theme.primaryText }}>
                  {this.state.response.response}
                </Text>
              ) : null}

              <Text style={{ color: theme.primaryText }}>{item.auto}</Text>
              <Text style={{ color: theme.primaryText }}>
                {getText("inPossession")}: {item.amount}
              </Text>
              <Text style={{ color: theme.primaryText }}>
                &euro;{item.cash}
              </Text>
              <Text style={{ color: theme.primaryText }}>
                {item.kogels} {getText("bullets")}
              </Text>

              <T bold style={{ marginTop: 15 }}>
                {getText("amount")}:
              </T>
              <TextInput
                key={`amount${item.id}`}
                style={style(device.theme).textInput}
                value={value}
                onChangeText={(x) =>
                  this.setState({
                    amount: { ...this.state.amount, [item.id]: x },
                  })
                }
                placeholderTextColor={theme.secondaryTextSoft}
                placeholder={getText("amount")}
              />
            </View>

            <View style={{ justifyContent: "space-between", marginBottom: 15 }}>
              <Button
                theme={this.props.screenProps.device.theme}
                title={getText("sell")}
                onPress={() =>
                  this.bulkAction("sell", item.auto, this.state.amount[item.id])
                }
              />

              <Button
                theme={this.props.screenProps.device.theme}
                title={getText("crush")}
                onPress={() =>
                  this.bulkAction(
                    "crush",
                    item.auto,
                    this.state.amount[item.id]
                  )
                }
              />
              <Button
                theme={this.props.screenProps.device.theme}
                title={getText("upgrade")}
                onPress={() => this.upgradeCar(item.id)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {
      navigation,
      screenProps: { me },
    } = this.props;
    const { cars, carGroups, id, view, filter } = this.state;

    return (
      <FlatList
        numColumns={width > 1000 ? 2 : 1}
        contentContainerStyle={{ alignItems: "center" }}
        keyExtractor={(item, index) => `item${index}`}
        data={carGroups}
        renderItem={this.renderGroup}
        ItemSeparatorComponent={Separator}
      />
    );
  }
}

export default Garage;
