import moment from "moment";
import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import Button from "../components/Button";
import CountDown from "../components/Countdown";
import T from "../components/T";
import User from "../components/User";
import style from "../Style";
import { doOnce, get, getTextFunction, post } from "../Util";

const Detectives = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [detectives, setDetectives] = useState([]);
  const [response, setResponse] = useState(null);
  const [type, setType] = useState("slow");
  const [name, setName] = useState("");

  const postHireDetective = async () => {
    const { response } = await post("hireDetective", {
      loginToken: device.loginToken,
      name,
      type,
    });

    setResponse(response);
    getDetectives();
  };

  const getDetectives = async () => {
    const { detectives } = await get(
      `detectives?loginToken=${device.loginToken}`
    );
    setDetectives(detectives);
  };

  doOnce(getDetectives);

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <View style={{ flex: 1, margin: 20 }}>
        <View>
          {response ? <T>{response}</T> : null}

          <TextInput
            style={style(theme).textInput}
            placeholder={getText("name")}
            placeholderTextColor={theme.secondaryTextSoft}
            value={name}
            onChangeText={setName}
          />

          <Button
            style={{ marginBottom: 10 }}
            title={getText(type + "Detective")}
            onPress={() =>
              setType(
                type === "slow" ? "normal" : type === "normal" ? "fast" : "slow"
              )
            }
          />

          <T>
            {getText(
              "detectiveCost",
              type === "slow" ? 100000 : type === "normal" ? 1000000 : 10000000,
              getText(type + "Detective")
            )}
          </T>

          <Button title={getText("hire")} onPress={postHireDetective} />

          <View style={{ height: 100 }} />
          {detectives?.map?.((detective) => (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {detective.user && (
                <User user={detective.user} size={40} navigation={navigation} />
              )}

              {detective.city ? (
                <T>{detective.city}</T>
              ) : (
                <CountDown
                  style={{ marginLeft: 10 }}
                  until={moment(detective.createdAt)
                    .add(detective.seconds, "seconds")
                    .valueOf()}
                  digitStyle={{ backgroundColor: theme.secondary }}
                  digitTxtStyle={{ color: theme.secondaryText }}
                  size={8}
                  timeToShow={["mm", "ss"]}
                />
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Detectives;
