import moment from "moment";
import React, { useState } from "react";
import { ScrollView, Switch, TextInput, View } from "react-native";
import Button from "../components/Button";
import H1 from "../components/H1";
import T from "../components/T";
import Constants from "../Constants";
import style from "../Style";
import { doOnce, get, getTextFunction, post } from "../Util";
const SuperMessage = ({ screenProps: { me, device } }) => {
  const [response, setResponse] = useState(null);
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [date, setDate] = useState(moment().format("DD/MM/YYYY"));

  //for admin
  const [scheduled, setScheduled] = useState([]);
  const [messages, setMessages] = useState({});
  const [dates, setDates] = useState({});

  const getScheduled = async () => {
    if (me?.level === 10) {
      const { scheduled, response } = await get(
        `scheduled?token=${device.loginToken}`
      );
      if (scheduled) {
        setScheduled(scheduled);
        setMessages(
          scheduled.reduce(
            (previous, current) => ({
              ...previous,
              [current.id]: current.message,
            }),
            {}
          )
        );

        setDates(
          scheduled.reduce(
            (previous, current) => ({
              ...previous,
              [current.id]: moment(current.date).format("DD/MM/YYYY"),
            }),
            {}
          )
        );
      }
    }
  };
  doOnce(getScheduled);

  const saveScheduled = async (id) => {
    const { response } = await post("updateScheduled", {
      token: device.loginToken,
      message: messages[id],
      date: moment(dates[id], "DD/MM/YYYY").set("hours", 17).valueOf(),
      id,
    });

    getScheduled();

    setResponse(response);
  };
  const sendMessage = () => {
    fetch(`${Constants.SERVER_ADDR}/superMessage`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: device.loginToken,
        message,
        date: date
          ? moment(date, "DD/MM/YYYY").set("hours", 17).valueOf()
          : undefined,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setResponse(response?.response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getText = getTextFunction(me?.locale);

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <T>{getText("superMessageInfo", me?.credits)}</T>
      {response ? <T>{response}</T> : null}

      {me?.level === 10 && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Switch value={schedule} onValueChange={setSchedule} />
          {schedule && (
            <TextInput
              style={style(device.theme).textInput}
              placeholder={getText("date")}
              placeholderTextColor={device.theme.secondaryTextSoft}
              value={date}
              onChangeText={setDate}
            />
          )}
        </View>
      )}
      <TextInput
        style={[style(device.theme).textInput, { height: 200 }]}
        placeholder={getText("message")}
        placeholderTextColor={device.theme.secondaryTextSoft}
        multiline
        value={message}
        onChangeText={setMessage}
      />

      <Button
        theme={device.theme}
        style={{ marginVertical: 10 }}
        title={getText("send")}
        onPress={sendMessage}
      />

      {me?.level === 10 && (
        <View>
          <H1>{getText("scheduled")}</H1>

          {scheduled?.map((message, index) => {
            return (
              <View key={`message${index}`} style={{ flexDirection: "row" }}>
                <TextInput
                  style={[
                    style(device.theme).textInput,
                    { height: 100, width: 200, flex: 1 },
                  ]}
                  placeholder={getText("message")}
                  placeholderTextColor={device.theme.secondaryTextSoft}
                  multiline
                  value={messages[message.id]}
                  onChangeText={(msg) =>
                    setMessages({ ...messages, [message.id]: msg })
                  }
                />

                <TextInput
                  style={[
                    style(device.theme).textInput,
                    { marginHorizontal: 10, height: 40 },
                  ]}
                  placeholder={getText("date")}
                  placeholderTextColor={device.theme.secondaryTextSoft}
                  value={dates[message.id]}
                  onChangeText={(date) =>
                    setDates({ ...dates, [message.id]: date })
                  }
                />

                <Button
                  theme={device.theme}
                  style={{ marginVertical: 10 }}
                  title={getText("send")}
                  onPress={() => saveScheduled(message.id)}
                />
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default SuperMessage;
