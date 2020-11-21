import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import T from "../components/T";
import Constants from "../Constants";
import { doOnce, get, getTextFunction, numberFormat } from "../Util";

const { width } = Dimensions.get("window");
const SIZE = 100;
const MARGIN = 10;
const Gangs = ({
  navigation,
  screenProps: {
    device,
    me,
    cities,
    reloadMe,
    reloadCities,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);

  const getGangs = async () => {
    setLoading(true);
    const { gangs } = await get("gangs");
    setLoading(false);
    setResponse(gangs);
  };

  doOnce(getGangs);

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <FlatList
        refreshing={loading}
        onRefresh={getGangs}
        data={response}
        numColumns={Math.floor(width / (SIZE + MARGIN * 2))}
        keyExtractor={(item, index) => `index${index}`}
        renderItem={({ item, index }) => {
          const navigate = () =>
            navigation.navigate("Gang", { name: item.name });
          return (
            <TouchableOpacity onPress={navigate} style={{ margin: MARGIN }}>
              {item.thumbnail ? (
                <Image
                  source={{ uri: Constants.SERVER_ADDR + "/" + item.thumbnail }}
                  style={{ width: SIZE, height: SIZE }}
                />
              ) : (
                <Image
                  source={require("../../assets/icon.png")}
                  style={{ width: SIZE, height: SIZE }}
                />
              )}
              <T>
                {getText("name")}: {item.name}
              </T>
              <T>
                {getText("members")}: {item.members}
              </T>
              <T>
                {getText("bank")}: €{numberFormat(item.bank)},-
              </T>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Gangs;
