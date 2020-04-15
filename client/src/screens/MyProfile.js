import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import T from "../components/T";
import Button from "../components/Button";
import Constants from "../Constants";
import { TextInput } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 800;

class MyProfile extends React.Component {
  state = {
    photo: null,
    images: [],
    selectedImage: null,
  };

  componentDidMount() {
    this.getPermissionAsync();
    this.fetchImages();

    const { me } = this.props.screenProps;
    console.log("bio", me?.bio);
    this.setState({ bio: me?.bio });
  }

  fetchImages = () => {
    const { device, me } = this.props.screenProps;

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
        this.setState({ images });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleUploadPhoto = () => {
    const { device } = this.props.screenProps;

    fetch(`${Constants.SERVER_ADDR}/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: this.state.photo.uri,
        token: device.loginToken,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.fetchImages();
        alert("Gelukt");
        this.setState({ photo: null });
      })
      .catch((error) => {
        console.log("upload error", error);
        alert("Er ging iets mis");
      });
  };

  getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  handleChoosePhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        base64: true,
        quality: 1,
      });

      if (!result.cancelled) {
        this.setState({ photo: result }, () => this.handleUploadPhoto());
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderItem = ({ item, index }) => {
    const uri = Constants.SERVER_ADDR + "/" + item.image;
    return (
      <TouchableOpacity
        onPress={() => this.setState({ selectedImage: item.id })}
      >
        <View>
          <Image
            source={{ uri }}
            style={{
              width: 200,
              height: 200,
              ...(this.state.selectedImage === item.id
                ? { borderWidth: 2, borderColor: "black" }
                : {}),
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    const { device } = this.props.screenProps;

    return (
      <Button
        title="Verwijder"
        onPress={() => {
          if (this.state.selectedImage) {
            fetch(`${Constants.SERVER_ADDR}/deleteimage`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: device.loginToken,
                id: this.state.selectedImage,
              }),
            })
              .then((response) => response.json())
              .then(({ images }) => {
                this.fetchImages();
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            alert("Geen afbeelding geselecteerd");
          }
        }}
      />
    );
  };

  render() {
    const { photo, images, bio } = this.state;
    const { device } = this.props.screenProps;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TextInput
          style={{ width: "100%", backgroundColor: "#202020", color: "white" }}
          multiline={true}
          numberOfLines={4}
          value={bio}
          onChangeText={(bio) => this.setState({ bio })}
        />
        <Button
          title="Opslaan"
          onPress={() => {
            fetch(`${Constants.SERVER_ADDR}/updateProfile`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bio: this.state.bio,
                loginToken: device.loginToken,
              }),
            })
              .then((response) => response.json())
              .then((response) => {
                alert("Gelukt");
              })
              .catch((error) => {
                console.log("upload error", error);
                alert("Er ging iets mis");
              });
          }}
        />

        <Button title="Kies afbeelding" onPress={this.handleChoosePhoto} />

        <FlatList
          data={images}
          extraData={this.state.selectedImage}
          // contentContainerStyle={{ flexDirection: "row" }}
          numColumns={isSmallDevice ? 1 : 3}
          renderItem={this.renderItem}
          keyExtractor={(item) => `id${item.id}`}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

export default MyProfile;
