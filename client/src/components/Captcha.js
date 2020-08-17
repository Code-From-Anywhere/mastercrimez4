import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import Constants from "../Constants";
import style from "../Style";

const Captcha = ({
  screenProps,
  onChangeCaptcha,
  captcha,
  random,
  onChangeRandom,
}) => {
  const uri =
    Constants.SERVER_ADDR +
    `/captcha.png?random=${random}&loginToken=${screenProps.device.loginToken}`;

  return (
    screenProps.me.needCaptcha && (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri }}
          style={{ marginLeft: 20, width: 150, height: 50 }}
        />
        <TextInput
          style={[style(screenProps.device.theme).textInput, { width: 100 }]}
          value={captcha}
          onChangeText={onChangeCaptcha}
        />
        <TouchableOpacity onPress={() => onChangeRandom(Math.random())}>
          <MaterialCommunityIcons
            name="reload"
            size={32}
            color={screenProps.device.theme.primaryText}
          />
        </TouchableOpacity>
      </View>
    )
  );
};

export default Captcha;
