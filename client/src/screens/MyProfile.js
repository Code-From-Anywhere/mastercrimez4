import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React, { useCallback, useState } from "react";
import { Image, Platform, ScrollView, TouchableOpacity } from "react-native";
import Button from "../components/Button";
import MarkdownEditor from "../components/MarkdownEditor";
import Constants from "../Constants";
import { getTextFunction } from "../Util";

const MyProfile = ({ screenProps: { me, device, reloadMe } }) => {
  const getText = getTextFunction(me?.locale);

  const [image, setImage] = useState(me?.image);
  const [bio, setBio] = useState(me?.bio || "");
  const setBioCallback = useCallback((bio) => setBio(bio), [setBio]);

  const handleChooseImage = async () => {
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

  const getPermissionAsync = async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        margin: 5,
      }}
    >
      <TouchableOpacity onPress={handleChooseImage}>
        {image ? (
          <Image
            source={{
              uri: image.includes("data:image")
                ? image
                : Constants.SERVER_ADDR + image,
            }}
            style={{ width: 40, height: 40 }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>

      <MarkdownEditor value={bio} onChange={setBioCallback} />
      <Button
        title={getText("save")}
        style={{ marginVertical: 5 }}
        onPress={() => {
          fetch(`${Constants.SERVER_ADDR}/updateProfile`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bio: bio,
              image,
              loginToken: device.loginToken,
            }),
          })
            .then((response) => response.json())
            .then((response) => {
              alert(getText("success"));
              reloadMe(device.loginToken);
            })
            .catch((error) => {
              console.log("upload error", error);
              alert(getText("somethingWentWrong"));
            });
        }}
      />
    </ScrollView>
  );
};

export default MyProfile;
