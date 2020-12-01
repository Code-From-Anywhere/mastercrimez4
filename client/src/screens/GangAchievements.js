import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import H1 from "../components/H1";
import T from "../components/T";
import { doOnce, get, getTextFunction } from "../Util";

const GangAchievements = ({
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

  const [result, setResult] = useState({ response: getText("loading") });
  const [loading, setLoading] = useState(false);

  const getGangAchievements = async () => {
    setLoading(true);
    const result = await get(`gangAchievements?token=${device.loginToken}`);
    setResult(result);
    setLoading(false);
  };

  doOnce(getGangAchievements);

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {result.response ? (
        <T>{result.response}</T>
      ) : (
        <View>
          <View style={{ marginBottom: 20 }}>
            <H1>
              {getText("level")}: {result.power}
            </H1>
          </View>
          {result.achievements &&
            Object.keys(result.achievements).map((key) => {
              const stats = result.achievements[key];

              return (
                <View style={{ marginBottom: 20 }}>
                  <T bold style={{ alignSelf: "center", marginVertical: 20 }}>
                    {getText(key)}
                  </T>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 150,
                        backgroundColor: theme.secondary,
                        padding: 20,
                        borderRadius: 10,
                      }}
                    >
                      <T>
                        {getText("level")}: {stats.level}
                      </T>

                      <T>
                        {getText("average")}: {stats.current}
                      </T>
                    </View>

                    <AntDesign
                      name="arrowright"
                      color={theme.primaryText}
                      size={36}
                    />

                    <View
                      style={{
                        width: 150,
                        backgroundColor: theme.secondary,
                        padding: 20,
                        borderRadius: 10,
                      }}
                    >
                      {stats.next && (
                        <T>
                          {getText("level")}: {stats.level + 1}
                        </T>
                      )}
                      <T>
                        {stats.next
                          ? `${getText("average")}: ${stats.next}`
                          : getText("maximumLevel")}
                      </T>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      )}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default GangAchievements;
