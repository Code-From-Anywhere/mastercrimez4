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
import User from "../components/User";
import { doOnce, get, getTextFunction, post } from "../Util";
import { RobberyTypes } from "./CreateRobbery";

const { width, height } = Dimensions.get("window");
const Robbery = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    robberies,
    reloadRobberies,
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

  doOnce(reloadRobberies);
  doOnce(fetchRacecars);

  const join = async (robberyId) => {
    setLoading(true);
    const { success, response } = await post("joinRobbery", {
      loginToken,
      robberyId,
    });
    setResponse(response);
    setLoading(false);
    if (success) {
      reloadRobberies();
      reloadMe(loginToken);
    }
  };

  const leave = async (robberyId) => {
    setLoading(true);
    const { response } = await post("leaveRobbery", {
      loginToken,
      robberyId,
    });
    setResponse(response);
    reloadRobberies();
    setLoading(false);
    reloadMe(loginToken);
  };

  const start = async (robberyId) => {
    setLoading(true);
    const { response } = await post("startRobbery", {
      loginToken,
      robberyId,
    });
    setResponse(response);
    setLoading(false);
    reloadMe(loginToken);
    reloadRobberies();
  };

  const renderItem = ({ item, index }) => {
    const type = RobberyTypes.find((x) => x.type === item.type);

    return (
      <View style={{ flexDirection: "row" }}>
        <Image
          source={type.image}
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
            {getText("participants")}: {item.robberyParticipants.length}/
            {item.numParticipants}
          </T>
          <T>
            {getText("costs")}: €{type.cost},-
          </T>
          <T>
            {getText("profit")}: €{type.profit * item.numParticipants},-
          </T>

          <T>
            {getText("difficulty")}: {type.difficulty}
          </T>
          {item.robberyParticipants.length > 0 &&
            item.robberyParticipants.map((p) => (
              <User user={p.user} navigation={navigation} size={40} />
            ))}

          {!!item.robberyParticipants.find((x) => x.name === me?.name) ? (
            item.robberyParticipants.length === item.numParticipants ? (
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
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateRobbery")}
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
              reloadRobberies();
              setResponse(null);
            }}
          />
        }
        data={robberies}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Robbery;
