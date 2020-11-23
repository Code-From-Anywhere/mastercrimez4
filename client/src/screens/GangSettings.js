import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import Constants from "../Constants";
import styles from "../Style";
import { doOnce, get, getTextFunction, numberFormat, post } from "../Util";
const { height, width } = Dimensions.get("window");
const GANG_LEVEL_UNDERBOSS = 3;
const GANG_LEVEL_BANK = 2;
const GANG_LEVEL_BOSS = 4;

const GangSettings = ({
  screenProps: {
    device,
    me,
    reloadMe,
    device: { theme },
  },
}) => {
  const getText = getTextFunction(me?.locale);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [gang, setGang] = useState({});
  const [username, setUsername] = useState("");
  const [gangName, setGangName] = useState("");
  const [profile, setProfile] = useState(me?.gang?.profile || "");
  const [name, setName] = useState(me?.gang?.name || "");
  const [image, setImage] = useState(me?.gang?.image || "");
  const [isBullets, setIsBullets] = useState(false);
  const [amount, setAmount] = useState("");
  const { showActionSheetWithOptions } = useActionSheet();

  const [showConfirmGangRemoveForm, setShowConfirmGangRemoveForm] = useState(
    false
  );
  const [showConfirmGangLeaveForm, setShowConfirmGangLeaveForm] = useState(
    false
  );

  const getGang = async () => {
    setLoading(true);

    const gang = await get(`gang?name=${me?.gang?.name}`);
    setLoading(false);
    setGang(gang);
  };

  const getGangInvites = async () => {
    setLoading(true);
    const { requests } = await get(`gangInvites?token=${device.loginToken}`);
    setLoading(false);
    setRequests(requests);
  };

  const postGangAnswerJoin = async (id, accepted) => {
    setLoading(true);
    const { response } = await post("gangAnswerJoin", {
      token: device.loginToken,
      id,
      accepted,
    });
    setLoading(false);
    setResponse(response);
  };

  const postGangUpdate = async () => {
    setLoading(true);
    const { response } = await post("gangUpdate", {
      token: device.loginToken,
      profile,
      image,
      name,
    });
    setLoading(false);
    setResponse(response);
    reloadMe(device.loginToken);
  };

  const postGangInvite = async () => {
    setLoading(true);
    const { response } = await post("gangInvite", {
      token: device.loginToken,
      name: username,
    });
    setLoading(false);
    setResponse(response);
  };

  const postGangTransaction = async (isToUser) => {
    setLoading(true);
    const { response } = await post("gangTransaction", {
      token: device.loginToken,
      amount,
      isToUser,
      isBullets,
    });
    reloadMe(device.loginToken);
    setLoading(false);
    setResponse(response);
  };

  const postGangLeave = async () => {
    if (gangName !== me?.gang?.name) {
      alert(getText("pleaseFillInGangName"));
      return;
    }

    setLoading(true);
    const { response } = await post("gangLeave", {
      token: device.loginToken,
    });
    setLoading(false);
    setResponse(response);
  };

  const postGangKick = async (userId) => {
    setLoading(true);
    const { response } = await post("gangKick", {
      token: device.loginToken,
      userId,
    });
    setLoading(false);
    setResponse(response);
  };

  const getGangLevel = (gangLevel) =>
    getText(
      gangLevel === GANG_LEVEL_BOSS
        ? "gangLevelBoss"
        : gangLevel === GANG_LEVEL_UNDERBOSS
        ? "gangLevelUnderboss"
        : gangLevel === GANG_LEVEL_BANK
        ? "gangLevelBank"
        : "gangLevelMember"
    );

  const postGangRemove = async () => {
    if (gangName !== me?.gang?.name) {
      alert(getText("pleaseFillInGangName"));
      return;
    }
    setShowConfirmGangRemoveForm(false);

    setLoading(true);
    const { response } = await post("gangRemove", {
      token: device.loginToken,
    });
    setLoading(false);
    setResponse(response);
    reloadMe(device.loginToken);
  };

  const postGangSetRank = async (userId, rank) => {
    setLoading(true);
    const { response } = await post("gangSetRank", {
      token: device.loginToken,
      userId,
      rank,
    });
    setLoading(false);
    setResponse(response);
    reloadMe(device.loginToken);
    getGang();
  };

  doOnce(getGangInvites);
  doOnce(getGang);

  const changeRank = (userId) => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [
      getText("gangLevelMember"),
      getText("gangLevelBank"),
      getText("gangLevelUnderboss"),
      getText("gangLevelBoss"),
    ];
    options.push(getText("cancel"));
    const destructiveButtonIndex = undefined;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex < 4) {
          postGangSetRank(userId, buttonIndex + 1);
        }
        // Do something here depending on the button index selected
      }
    );
  };
  const getPermissionAsync = async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert(getText("weNeedCameraPermission"));
      }
    }
  };
  const handleChoosePhoto = async () => {
    await getPermissionAsync();

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        base64: true,
        quality: 1,
      });

      if (!result.cancelled) {
        // console.log(Object.keys(result));
        setImage(
          result.base64
            ? `data:image/${result.type};base64,${result.base64}`
            : result.uri //web has the base64 in the uri
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        {loading && <ActivityIndicator />}
        {response && <T>{response}</T>}
      </View>
      <ScrollView
        contentContainerStyle={{
          height: Platform.OS === "web" ? 0 : undefined,
        }}
        style={{ flex: 1, padding: 15 }}
      >
        {!me?.gang?.id ? (
          <T>{getText("noAccess")}</T>
        ) : (
          <View>
            <View style={{ marginVertical: 20 }}>
              <T>{getText("youAreWhat", getGangLevel(me?.gangLevel))}</T>
            </View>

            {/* Answer join */}
            <View style={{ marginVertical: 20 }}>
              <T bold>{getText("gangJoinRequestsTitle")}</T>
              {requests.length > 0 ? (
                requests.map((request) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <T>{request.user?.name}</T>
                      <View style={{ flexDirection: "row" }}>
                        <Button
                          title={getText("accept")}
                          onPress={() => postGangAnswerJoin(request.id, true)}
                        />
                        <Button
                          title={getText("decline")}
                          onPress={() => postGangAnswerJoin(request.id, false)}
                        />
                      </View>
                    </View>
                  );
                })
              ) : (
                <T>{getText("noJoinRequests")}</T>
              )}
            </View>

            {/* Invite */}
            <View style={{ marginVertical: 20, flexDirection: "row" }}>
              <TextInput
                placeholderTextColor={theme.secondaryTextSoft}
                style={styles(theme).textInput}
                value={username}
                onChangeText={setUsername}
                placeholder={getText("name")}
              />
              <Button
                title={getText("invite")}
                onPress={postGangInvite}
                style={{ flex: 1, marginVertical: 10, marginLeft: 10 }}
              />
            </View>

            {/* Transactions */}
            {me?.gangLevel === GANG_LEVEL_BANK ||
            me?.gangLevel === GANG_LEVEL_BOSS ? (
              <View style={{ marginVertical: 20 }}>
                <T>
                  {getText("bankMoney")}: €{numberFormat(me?.gang?.bank || 0)},-
                </T>
                <T>
                  {getText("bullets")}: {numberFormat(me?.gang?.bullets || 0)}
                </T>
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    placeholderTextColor={theme.secondaryTextSoft}
                    style={styles(theme).textInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder={getText("amount")}
                  />

                  <Button
                    title={isBullets ? getText("bullets") : getText("bank")}
                    onPress={() => setIsBullets(!isBullets)}
                    style={{ flex: 1, marginVertical: 10, marginLeft: 10 }}
                  />

                  <Button
                    title={getText("in")}
                    onPress={() => postGangTransaction(false)}
                    style={{ flex: 1, marginVertical: 10, marginLeft: 10 }}
                  />
                  <Button
                    title={getText("out")}
                    onPress={() => postGangTransaction(true)}
                    style={{ flex: 1, marginVertical: 10, marginLeft: 10 }}
                  />
                </View>
              </View>
            ) : null}

            {/* memberview with kick or change rank, per member */}
            {me?.gangLevel >= GANG_LEVEL_UNDERBOSS && (
              <View style={{ marginVertical: 20 }}>
                {gang?.users?.map((member) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <T>{member.name}</T>
                      <T>{getGangLevel(member.gangLevel)}</T>
                      <View style={{ flexDirection: "row" }}>
                        {me?.gangLevel >= GANG_LEVEL_UNDERBOSS &&
                          member.id !== me?.id && (
                            <Button
                              title={getText("kick")}
                              onPress={() => postGangKick(member.id)}
                            />
                          )}
                        {me?.gangLevel === GANG_LEVEL_BOSS && (
                          <Button
                            title={getText("changeRank")}
                            style={{ marginLeft: 10 }}
                            onPress={() => changeRank(member.id)}
                          />
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            {/* update name,profile,image */}

            {me?.gangLevel >= GANG_LEVEL_UNDERBOSS && (
              <View style={{ marginVertical: 20 }}>
                <TouchableOpacity onPress={handleChoosePhoto}>
                  {image ? (
                    <Image
                      source={{
                        uri: image.includes("data:image")
                          ? image
                          : Constants.SERVER_ADDR + image,
                      }}
                      style={{ width: 200, height: 200 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={require("../../assets/icon.png")}
                      style={{ width: 200, height: 200 }}
                      resizeMode="cover"
                    />
                  )}
                </TouchableOpacity>
                <TextInput
                  placeholderTextColor={theme.secondaryTextSoft}
                  style={styles(theme).textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder={getText("gangName")}
                />

                <TextInput
                  placeholderTextColor={theme.secondaryTextSoft}
                  style={[
                    styles(theme).textInput,
                    {
                      width: "100%",
                      height: 200,
                    },
                  ]}
                  multiline={true}
                  value={profile}
                  onChangeText={setProfile}
                />
                <Button
                  onPress={postGangUpdate}
                  title={getText("save")}
                  style={{ marginTop: 10 }}
                />
              </View>
            )}
            {/* transactions */}

            {/* Leave */}
            <View style={{ marginVertical: 20 }}>
              {showConfirmGangLeaveForm ? (
                <View>
                  <TextInput
                    placeholderTextColor={theme.secondaryTextSoft}
                    style={styles(theme).textInput}
                    value={gangName}
                    onChangeText={setGangName}
                    placeholder={getText("gangName")}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button title={getText("yes")} onPress={postGangLeave} />
                    <Button
                      title={getText("no")}
                      onPress={() => setShowConfirmGangLeaveForm(false)}
                    />
                  </View>
                </View>
              ) : (
                <Button
                  title={getText("leaveGang")}
                  onPress={() => setShowConfirmGangLeaveForm(true)}
                />
              )}
            </View>

            {/* Gang delete */}
            <View style={{ marginVertical: 20 }}>
              {me?.gangLevel === GANG_LEVEL_BOSS &&
                (showConfirmGangRemoveForm ? (
                  <View>
                    <TextInput
                      placeholderTextColor={theme.secondaryTextSoft}
                      style={styles(theme).textInput}
                      value={gangName}
                      onChangeText={setGangName}
                      placeholder={getText("gangName")}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button title={getText("yes")} onPress={postGangRemove} />
                      <Button
                        title={getText("no")}
                        onPress={() => setShowConfirmGangRemoveForm(false)}
                      />
                    </View>
                  </View>
                ) : (
                  <Button
                    title={getText("removeGang")}
                    onPress={() => setShowConfirmGangRemoveForm(true)}
                  />
                ))}
            </View>

            <View style={{ height: 80 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default GangSettings;
