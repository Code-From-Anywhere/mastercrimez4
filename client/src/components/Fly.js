import React, { useCallback } from "react";
import { Text, View } from "react-native";
import CountDown from "../components/Countdown";
import { getTextFunction } from "../Util";

const Fly = ({ screenProps: { me, device, reloadMe } }) => {
  const getText = getTextFunction(me?.locale);

  const onFinishCallback = useCallback(() => {
    reloadMe(device.loginToken);
  }, [reloadMe, device.loginToken]);

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: device.theme.primaryText }}>
        {getText("flyYoureTravelingTo", me?.city)}
      </Text>
      <CountDown
        until={me?.reizenAt}
        onFinish={onFinishCallback}
        size={20}
        timeToShow={["mm", "ss"]}
        timeLabels={{ mm: getText("minutes"), ss: getText("seconds") }}
      />
    </View>
  );
};

export default Fly;
