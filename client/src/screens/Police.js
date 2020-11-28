import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import Gang from "../components/Gang";
import T from "../components/T";
import User from "../components/User";
import { doOnce, get, getTextFunction } from "../Util";

const AdminUserWatch = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    device: { theme, loginToken },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  const [gangs, setGangs] = useState([]);
  const getGangs = async () => {
    const { gangs } = await get("police");
    setGangs(gangs);
  };
  doOnce(getGangs);
  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {/* show all people with level >2 */}
      <Image
        source={require("../../assets/politie.jpeg")}
        style={{ width: 400, height: 300 }}
      />
      <T>{getText("policeInfo")}</T>

      <T bold style={{ marginTop: 20 }}>
        {getText("currentPolice")}
      </T>
      {gangs.map((gang) => {
        return (
          <View style={{ flex: 1 }}>
            <Grid style={{ marginTop: 20 }}>
              <Col>
                <Gang gang={gang} navigation={navigation} />
              </Col>

              <Col style={{ justifyContent: "center" }}>
                <T>
                  {gang.bullets} {getText("bullets")}
                </T>
              </Col>
            </Grid>
            {gang.users.map((user) => (
              <Grid style={{ marginTop: 10 }}>
                <Col>
                  <User navigation={navigation} user={user} size={40} />
                </Col>
              </Grid>
            ))}
          </View>
        );
      })}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default AdminUserWatch;
