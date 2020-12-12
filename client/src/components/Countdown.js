import moment from "moment";
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { Text, View } from "react-native";

const Countdown = React.memo(function CountdownPure({
  until,
  timeToShow,
  timeLabels,
  size,
}) {
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(until - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const [timeLeft, setTimeLeft] = useState(until - Date.now());

  return (
    <View style={{ flexDirection: "row" }}>
      {timeToShow.map((label) => {
        return (
          <View key={label}>
            <Text>{moment(timeLeft).format(label)}</Text>
          </View>
        );
      })}
    </View>
  );
},
isEqual);

Countdown.whyDidYouRender = true;

export default Countdown;
