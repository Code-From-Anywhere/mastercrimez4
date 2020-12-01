import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import T from "../components/T";
import User from "../components/User";
import { doOnce, get, getTextFunction, post } from "../Util";

const Blocks = ({
  navigation,
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [blocks, setBlocks] = useState([]);
  const [response, setResponse] = useState(null);

  const postRemoveBlock = async (user2id) => {
    const { response } = await post("removeBlock", {
      loginToken: device.loginToken,
      user2id,
    });

    setResponse(response);
    getBlocks();
  };

  const getBlocks = async () => {
    const { blocks } = await get(`blocks?loginToken=${device.loginToken}`);

    setBlocks(blocks);
  };

  doOnce(getBlocks);

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <View style={{ flex: 1, margin: 20 }}>
        <View>
          {response ? <T>{response}</T> : null}

          {blocks?.map?.((block) => (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <User user={block.user} size={40} navigation={navigation} />

              <TouchableOpacity onPress={() => postRemoveBlock(block.user2id)}>
                <Entypo name="cross" color="red" size={33} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Blocks;
