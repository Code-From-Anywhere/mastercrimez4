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
const Oc = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    ocs,
    reloadOcs,
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

  doOnce(() => reloadOcs(loginToken));
  doOnce(fetchRacecars);

  const join = async (ocId) => {
    setLoading(true);
    const { success, response } = await post("joinOc", {
      loginToken,
      ocId,
    });
    setResponse(response);
    setLoading(false);
    if (success) {
      reloadOcs(loginToken);
      reloadMe(loginToken);
    }
  };

  const leave = async (ocId) => {
    setLoading(true);
    const { response } = await post("leaveOc", {
      loginToken,
      ocId,
    });
    setResponse(response);
    reloadOcs(loginToken);
    setLoading(false);
    reloadMe(loginToken);
  };

  const start = async (ocId) => {
    setLoading(true);
    const { response } = await post("startOc", {
      loginToken,
      ocId,
    });
    setResponse(response);
    setLoading(false);
    reloadMe(loginToken);
    reloadOcs(loginToken);
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
            {getText("participants")}: {item.ocParticipants.length}/
            {item.numParticipants}
          </T>
          <T>
            {getText("costs")}: €{item.price},-
          </T>
          <T>
            {getText("addedPrizeMoney")}: €{item.prize},-
          </T>
          {item.ocParticipants.length > 0 && (
            <T>{item.ocParticipants.map((x) => x.name).join(", ")}</T>
          )}

          {!!item.ocParticipants.find((x) => x.name === me?.name) ? (
            item.ocParticipants.length === item.numParticipants ? (
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
                join(item.id);
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
          <TouchableOpacity onPress={() => navigation.navigate("CreateOc")}>
            <AntDesign name="pluscircle" color="yellow" size={32} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          height: Platform.OS === "web" ? height - 200 : undefined,
        }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => <Footer screenProps={screenProps} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              reloadOcs(loginToken);
              setResponse(null);
            }}
          />
        }
        data={ocs}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Oc;
