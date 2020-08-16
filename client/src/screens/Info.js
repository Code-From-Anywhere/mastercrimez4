import * as StoreReview from "expo-store-review";
import React, { Component } from "react";
import { Linking, Platform, View } from "react-native";
import Menu from "../components/Menu";
class Status extends Component {
  render() {
    const {
      navigation,
      screenProps: {
        me,
        device: { theme },
      },
    } = this.props;

    return (
      <View>
        {Platform.OS !== "web" && (
          <Menu
            theme={theme}
            title="Geef een review"
            onPress={() => StoreReview.requestReview()}
            IconFont="AntDesign"
            icon="heart"
          />
        )}

        <Menu
          theme={theme}
          title="Feedback & Contact"
          onPress={() => Linking.openURL("mailto:mastercrimez@karsens.com")}
          IconFont="AntDesign"
          icon="heart"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Spel info"
          to="InfoGame"
          IconFont="AntDesign"
          icon="infocirlce"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Privacy Policy"
          to="Privacy"
          IconFont="AntDesign"
          icon="infocirlce"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Regels"
          to="InfoRules"
          IconFont="AntDesign"
          icon="infocirlce"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Draag bij"
          to="Contribute"
          IconFont="Entypo"
          icon="network"
        />
        <Menu
          theme={theme}
          navigation={navigation}
          title="Prijzen"
          to="Prizes"
          IconFont="AntDesign"
          icon="star"
        />
      </View>
    );
  }
}

export default Status;
