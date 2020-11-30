import { useActionSheet } from "@expo/react-native-action-sheet";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import Footer from "../components/Footer";
import T from "../components/T";
import { doOnce, get, getTextFunction, post } from "../Util";

const { width, height } = Dimensions.get("window");
const Streetrace = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    streetraces,
    reloadStreetraces,
    reloadMe,
    device: { theme, loginToken },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  // if (!__DEV__) return <T>Coming soon</T>;

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();
  const [racecars, setRacecars] = useState(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const fetchRacecars = async () => {
    setLoading(true);
    const cars = await get(`racecars?token=${loginToken}`);
    setRacecars(cars);
    setLoading(false);
  };

  doOnce(reloadStreetraces);
  doOnce(fetchRacecars);

  const join = async (streetraceId, car) => {
    setLoading(true);
    const { success, response } = await post("joinStreetrace", {
      loginToken,
      streetraceId,
      carId: car?.id,
    });
    setResponse(response);
    setLoading(false);
    if (success) {
      reloadStreetraces();
      reloadMe(loginToken);
    }
  };

  const leave = async (streetraceId) => {
    setLoading(true);
    const { response } = await post("leaveStreetrace", {
      loginToken,
      streetraceId,
    });
    setResponse(response);
    reloadStreetraces();
    setLoading(false);
    reloadMe(loginToken);
  };

  const start = async (streetraceId) => {
    setLoading(true);
    const { response } = await post("startStreetrace", {
      loginToken,
      streetraceId,
    });
    setResponse(response);
    setLoading(false);
    reloadMe(loginToken);
    reloadStreetraces();
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Image
          source={
            item.type === "city"
              ? require("../../assets/city.jpeg")
              : item.type === "highway"
              ? require("../../assets/highway.jpeg")
              : require("../../assets/forest.jpeg")
          }
          style={{ width: 170, height: 140 }}
          resizeMode={"contain"}
        />

        <View style={{ marginLeft: 10, flex: 1 }}>
          <T>
            {getText("organizer")}: {item.creator}
          </T>
          <T>
            {getText("place")}: {item.city}
          </T>
          <T>
            {getText("participants")}: {item.streetraceParticipants.length}/
            {item.numParticipants}
          </T>
          <T>
            {getText("costs")}: €{item.price},-
          </T>
          <T>
            {getText("addedPrizeMoney")}: €{item.prize},-
          </T>
          {item.streetraceParticipants.length > 0 && (
            <T>{item.streetraceParticipants.map((x) => x.name).join(", ")}</T>
          )}

          {!!item.streetraceParticipants.find((x) => x.name === me?.name) ? (
            item.streetraceParticipants.length === item.numParticipants ? (
              <Button
                theme={theme}
                title={getText("startCTA")}
                onPress={() => start(item.id)}
              />
            ) : (
              <Button
                theme={theme}
                title={getText("leaveCTA")}
                onPress={() => leave(item.id)}
              />
            )
          ) : (
            <Button
              theme={theme}
              title={getText("participate")}
              onPress={() => {
                // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
                const options = racecars.map(
                  (racecar) =>
                    `${racecar.auto} ${getText("with")} ${
                      racecar.power
                    }.000 ${getText("power")}`
                );
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
                    if (buttonIndex !== options.length - 1) {
                      join(item.id, racecars[buttonIndex]);
                    }
                    // Do something here depending on the button index selected
                  }
                );
              }}
            />
          )}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <View>{response && <T>{response}</T>}</View>

        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateStreetrace")}
          >
            <AntDesign name="pluscircle" color="yellow" size={32} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <FlatList
        contentContainerStyle={{
          height: Platform.OS === "web" ? height - 200 : undefined,
        }}
        ListFooterComponent={() => <Footer screenProps={screenProps} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              reloadStreetraces();
              setResponse(null);
            }}
          />
        }
        data={streetraces}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Streetrace;
