import * as StoreReview from "expo-store-review";
import React, { Component } from "react";
import { Linking, Platform, View } from "react-native";
import Menu from "../components/Menu";
import { getTextFunction } from "../Util";
class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;

    const getText = getTextFunction(me?.locale);

    return (
      <View>
        {Platform.OS !== "web" && (
          <Menu
            theme={theme}
            title={getText("giveAReview")}
            onPress={() => StoreReview.requestReview()}
            IconFont="AntDesign"
            icon="heart"
          />
        )}

        <Menu
          theme={theme}
          title={getText("feedbackAndContact")}
          onPress={() => Linking.openURL("mailto:mastercrimez@karsens.com")}
          IconFont="AntDesign"
          icon="heart"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("gameInfo")}
          to="InfoGame"
          IconFont="AntDesign"
          icon="infocirlce"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("privacyPolicy")}
          to="Privacy"
          IconFont="AntDesign"
          icon="infocirlce"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("rules")}
          to="InfoRules"
          IconFont="AntDesign"
          icon="infocirlce"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("contribute")}
          to="Contribute"
          IconFont="Entypo"
          icon="network"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title={getText("prizes")}
          to="Prizes"
          IconFont="AntDesign"
          icon="star"
        />
      </View>
    );
  }
}

export default Status;
