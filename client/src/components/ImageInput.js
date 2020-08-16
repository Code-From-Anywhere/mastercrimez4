import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as React from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "../Constants";

class ImageInput extends React.Component {
  state = { hasEdited: false };
  getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      console.log("granted", status);

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return false;
      }
      return true;
    }
  };

  _pickImage = async () => {
    const hasPermission = await this.getPermissionAsync();

    if (hasPermission) {
      try {
        this.setState({ loading: true });

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          base64: true,
        });

        if (!result.cancelled) {
          const base64 =
            Platform.OS === "web"
              ? result.uri
              : "data:image/png;base64," + result.base64;

          const manipulated = await ImageManipulator.manipulateAsync(
            Platform.OS === "web" ? base64 : result.uri,
            [{ resize: { width: 500, height: 500 } }],
            {
              format: ImageManipulator.SaveFormat.PNG,
              base64: true,
            }
          ).catch((e) => console.log("e", e));

          const manipulatedBase64 =
            Platform.OS === "web"
              ? manipulated.base64
              : "data:image/png;base64," + manipulated.base64;

          this.setState({ loading: false, hasEdited: true }, () => {
            this.props.onChange(manipulatedBase64);
          });
        } else {
          this.setState({ loading: false });
        }
      } catch (E) {
        console.log(E);
      }
    }
  };

  render() {
    const { hasEdited, loading } = this.state;
    const { value, small } = this.props;

    const SIZE = small ? 40 : 200;
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={this._pickImage}>
          {value ? (
            <Image
              source={{
                uri: hasEdited ? value : Constants.SERVER_ADDR + value,
              }}
              style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2 }}
            />
          ) : (
            <View
              style={{
                borderRadius: SIZE / 2,
                borderWidth: 2,
                borderColor: "#CCC",
                width: SIZE,
                height: SIZE,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Ionicons name="md-camera" color="#CCC" size={SIZE / 2} />
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

export default ImageInput;
