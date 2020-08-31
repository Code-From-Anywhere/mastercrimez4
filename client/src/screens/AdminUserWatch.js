import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import T from "../components/T";
import { doOnce, get } from "../Util";
const AdminUserWatch = ({
  navigation,
  screenProps,
  screenProps: {
    me,
    device: { theme, loginToken },
  },
}) => {
  const [ips, setIps] = useState([]);
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [actions, setActions] = useState(null);
  const [movements, setMovements] = useState(null);

  doOnce(async () => {
    const { ips } = await get(`admin/ips?token=${loginToken}`);
    setIps(ips);
  });

  useEffect(() => {
    const getActions = async () => {
      const { user, actions, movements } = await get(
        `admin/actions?token=${loginToken}&userId=${id}`
      );
      setUser(user);
      setActions(actions);
      setMovements(movements);
    };

    getActions();
  }, [id]);

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      {me?.level < 2 ? (
        <T>Geen toegang</T>
      ) : (
        <View style={{ flex: 1 }}>
          {id && user && actions && movements ? (
            <View>
              <TouchableOpacity onPress={() => setId(null)}>
                <T bold style={{ marginBottom: 20 }}>
                  Terug
                </T>
              </TouchableOpacity>

              <T>Naam: {user.name}</T>

              <T>Actions: {actions.length}</T>
              <T>Movements: {movements.length}</T>
            </View>
          ) : (
            ips.map((ip, index) => {
              const previous = ips[index - 1];

              return (
                <View key={`id${index}`}>
                  {previous?.ip === ip.ip ? null : (
                    <T bold style={{ marginTop: 20 }}>
                      {ip.ip}
                    </T>
                  )}
                  <TouchableOpacity onPress={() => setId(ip.id)}>
                    <T>{ip.name}</T>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      )}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default AdminUserWatch;
