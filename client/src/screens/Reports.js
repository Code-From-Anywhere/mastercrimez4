import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import T from "../components/T";
import User from "../components/User";
import { doOnce, get, getTextFunction, post } from "../Util";

const Reports = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [reports, setReports] = useState([]);
  const [response, setResponse] = useState(null);
  const [banReason, setBanReason] = useState("");

  const postReport = async (ban, userId) => {
    const { response } = await post("report", {
      token: device.loginToken,
      userId,
      ban,
      banReason,
    });

    setResponse(response);
    getReports();
  };

  const getReports = async () => {
    const { reports } = await get(`reports?loginToken=${device.loginToken}`);
    setReports(reports);
  };

  doOnce(getReports);

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <View style={{ flex: 1, margin: 20 }}>
        <View>
          {response ? <T>{response}</T> : null}

          {reports?.map?.((user) => (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <User user={user} size={40} navigation={navigation} />

              <View style={{ flexDirection: "row" }}>
                <T>{getText(user.ban)}</T>
                <T>
                  {getText("reason")}: {user.banReason}
                </T>
                <Button
                  title={getText("ban")}
                  onPress={() => postReport("banned", user.id)}
                />
                <Button
                  title={getText("shadowBan")}
                  onPress={() => postReport("shadowBanned", user.id)}
                />
                <TouchableOpacity onPress={() => postReport("none", user.id)}>
                  <Entypo name="cross" color="red" size={33} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Reports;
