import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MarkdownView from "react-native-markdown-display";
import { RefreshControl } from "react-native-web-refresh-control";
import ImageInput from "../components/ImageInput";
import ShareButtons from "../components/ShareButtons";
import T from "../components/T";
import Constants from "../Constants";
import STYLE from "../Style";
import { get, getTextFunction, post } from "../Util";

const { width, height } = Dimensions.get("window");
const isBigDevice = width > 500;

const IMAGE_SIZE = 40;

const Footer = ({ me, device, params, fetchChat }) => {
  const { loginToken, theme } = device;
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const getText = getTextFunction(me?.locale);

  const send = () => {
    setImage(null);
    setMessage("");
    const url = `${Constants.SERVER_ADDR}/channelmessage`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginToken: loginToken,
        image: hasEdited ? image : undefined,
        message,
        cid: params?.id,
      }),
    })
      .then((response) => response.json())
      .then(({ success }) => {
        if (success) {
          fetchChat();
        }
      })
      .catch((error) => {
        console.log(error, url);
      });
  };

  const renderFooter = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <ImageInput
            small
            value={image}
            onChange={(base64) => {
              setImage(base64);
              setHasEdited(true);
            }}
          />

          <TextInput
            multiline
            style={[STYLE(theme).textInput, { flex: 1 }]}
            value={message}
            placeholder={getText("message")}
            onChangeText={setMessage}
          />

          <TouchableOpacity onPress={send}>
            <Ionicons name="ios-send" size={32} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return renderFooter();
};

const ChatScreen = ({
  navigation,
  navigation: {
    state: { params },
  },
  screenProps: {
    device: { loginToken },
    device,
    me,
    reloadMe,
  },
}) => {
  const [isFetching, setIsFetching] = useState(true);
  const [chat, setChat] = useState([]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetchChat();

    const interval = setInterval(() => {
      fetchChat();
      post("setRead", { loginToken, id: params?.subid });
      reloadMe(loginToken);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchChat = async () => {
    const url = `channelmessage?loginToken=${device.loginToken}&id=${params.id}`;
    const response = await get(url);

    if (response) {
      setChat(response.chat);
      setResponse(response.response);
      setIsFetching(false);
    }
  };

  const onRefresh = () => {
    setIsFetching(true);
    fetchChat();
  };

  const renderItem = ({ item, index }) => {
    const isMe = item.user?.id === me?.id;
    const avatar = (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile", { name: item.user?.name });
        }}
      >
        <Image
          source={{ uri: Constants.SERVER_ADDR + item.user?.thumbnail }}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            borderRadius: IMAGE_SIZE / 2,
          }}
        />
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 0,
          justifyContent: isMe ? "flex-end" : "flex-start",
        }}
      >
        {!isMe ? avatar : null}
        <View
          style={{
            flex: 1,
            marginVertical: 10,
            marginHorizontal: 10,
            backgroundColor: item.isSystem
              ? "gray"
              : isMe
              ? "#d9f6c2"
              : "white",
            padding: 10,
            maxWidth: item.isSystem ? undefined : isBigDevice ? 400 : 200,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: "#CCC",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.user?.name}</Text>
          </View>
          {item.image ? (
            <Image
              source={{
                uri: Constants.SERVER_ADDR + item.image,
              }}
              style={{ width: 180, height: 180 }}
              resizeMode="cover"
            />
          ) : null}

          <MarkdownView>{item.message}</MarkdownView>

          {item.isShareable && (
            <ShareButtons me={me} text={item.message} url={``} />
          )}
        </View>
        {isMe ? avatar : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Array.isArray(chat) ? (
        <FlatList
          initialNumToRender={Platform.OS === "web" ? chat.length : undefined}
          contentContainerStyle={{
            height: Platform.OS === "web" ? height - 250 : undefined,
          }}
          data={chat}
          renderItem={renderItem}
          keyExtractor={(item, index) => `index${index}`}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          inverted
        />
      ) : (
        <View style={{ flex: 1 }}>
          <T>{response}</T>
        </View>
      )}
      <Footer me={me} device={device} params={params} fetchChat={fetchChat} />
    </SafeAreaView>
  );
};

export default ChatScreen;
