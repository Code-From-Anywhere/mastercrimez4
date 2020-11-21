import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
import { doOnce, getTextFunction } from "../Util";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

const MyProfile = ({
  screenProps: {
    me,
    device,
    device: { theme },
    reloadMe,
  },
}) => {
  const getText = getTextFunction(me?.locale);

  const [photo, setPhoto] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bio, setBio] = useState(me?.bio || "");

  doOnce(() => {
    getPermissionAsync();
    fetchImages();
  });

  const fetchImages = () => {
    fetch(
      `${Constants.SERVER_ADDR}/listimages?token=${device.loginToken}&uid=${me.id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then(({ images }) => {
        setImages(images);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUploadPhoto = (pic) => {
    fetch(`${Constants.SERVER_ADDR}/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: pic.uri,
        token: device.loginToken,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        fetchImages();
        alert(getText("success"));
        setPhoto(null);
      })
      .catch((error) => {
        console.log("upload error", error);
        alert(getText("somethingWentWrong"));
      });
  };

  const getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const handleChoosePhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        base64: true,
        quality: 1,
      });

      console.log("result", result);

      if (!result.cancelled) {
        setPhoto(result);
        handleUploadPhoto(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item, index }) => {
    const uri = Constants.SERVER_ADDR + "/" + item.image;
    return (
      <TouchableOpacity onPress={() => setSelectedImage(item.id)}>
        <View>
          <Image
            source={{ uri }}
            style={{
              width: 200,
              height: 200,
              ...(selectedImage === item.id
                ? { borderWidth: 2, borderColor: "black" }
                : {}),
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <Button
        title={getText("delete")}
        onPress={() => {
          if (selectedImage) {
            fetch(`${Constants.SERVER_ADDR}/deleteimage`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: device.loginToken,
                id: selectedImage,
              }),
            })
              .then((response) => response.json())
              .then(({ images }) => {
                fetchImages();
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            alert(getText("noPictureSelected"));
          }
        }}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
      }}
    >
      <TextInput
        placeholderTextColor={theme.secondaryTextSoft}
        style={[style(theme).textInput, { width: "100%", height: 200 }]}
        multiline={true}
        numberOfLines={4}
        value={bio}
        onChangeText={setBio}
      />
      <Button
        title={getText("save")}
        style={{ marginVertical: 20 }}
        onPress={() => {
          fetch(`${Constants.SERVER_ADDR}/updateProfile`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bio: bio,
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

      <Button
        style={{ marginVertical: 20 }}
        title={getText("choosePicture")}
        onPress={handleChoosePhoto}
      />

      <FlatList
        data={images}
        extraData={selectedImage}
        numColumns={isSmallDevice ? 1 : 3}
        renderItem={renderItem}
        keyExtractor={(item) => `id${item.id}`}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default MyProfile;
