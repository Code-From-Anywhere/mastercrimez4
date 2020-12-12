import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React, { useRef, useState } from "react";
import { Platform, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { AlertContext } from "../components/AlertProvider";
import Button from "../components/Button";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction } from "../Util";

const MarkdownEditor = React.memo(function MarkdownEditorPure({
  value,
  onChange,
}) {
  console.log("RENDER MARKDOWN EDItoR");
  const theme = useSelector((state) => state.device.theme);
  const loginToken = useSelector((state) => state.device.loginToken);
  const locale = useSelector((state) => state.me?.locale);
  const getText = getTextFunction(locale);

  const textInputRef = useRef(null);
  const [selection, setSelection] = useState({});
  const alertAlert = React.useContext(AlertContext);

  const handleUploadPhoto = (pic) => {
    console.log("PIC", pic);
    return fetch(`${Constants.SERVER_ADDR}/upload`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: Platform.OS === "web" ? pic.uri : pic.base64,
        token: loginToken,
      }),
    })
      .then((response) => response.json())
      .then(({ path }) => {
        return path;
      })
      .catch((error) => {
        console.log("upload error", error);
        alert(getText("somethingWentWrong"));
      });
  };

  const getPermissionAsync = async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
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

      console.log("result", result);

      if (!result.cancelled) {
        return handleUploadPhoto(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Button
          title="B"
          style={{ marginRight: 10 }}
          textStyle={{ fontWeight: "bold" }}
          onPress={() => {
            if (selection) {
              const text = value;
              const aroundChars = 2;
              const before = text.substring(0, selection.start);
              const current = text.substring(selection.start, selection.end);
              const after = text.substring(selection.end, text.length);
              const newText = `${before}**${current}**${after}`;
              onChange(newText);

              textInputRef.current?.focus();
              setTimeout(() => {
                setSelection({
                  start: selection.start + aroundChars,
                  end: selection.end + aroundChars,
                });
              }, 100);
            }
          }}
        />

        <Button
          title="I"
          style={{ marginRight: 10 }}
          textStyle={{ fontStyle: "italic" }}
          onPress={() => {
            if (selection) {
              const text = value;
              const aroundChars = 1;
              const before = text.substring(0, selection.start);
              const current = text.substring(selection.start, selection.end);
              const after = text.substring(selection.end, text.length);
              const newText = `${before}*${current}*${after}`;
              onChange(newText);

              textInputRef.current?.focus();
              setTimeout(() => {
                setSelection({
                  start: selection.start + aroundChars,
                  end: selection.end + aroundChars,
                });
              }, 100);
            }
          }}
        />

        <Button
          title="H1"
          style={{ marginRight: 10 }}
          onPress={() => {
            if (selection) {
              const text = value;
              const beforeChars = 3;
              const before = text.substring(0, selection.start);
              const current = text.substring(selection.start, selection.end);
              const after = text.substring(selection.end, text.length);
              const newText = `${before}\n# ${current}\n${after}`;
              onChange(newText);

              textInputRef.current?.focus();
              setTimeout(() => {
                setSelection({
                  start: selection.start + beforeChars,
                  end: selection.end + beforeChars,
                });
              }, 100);
            }
          }}
        />

        <Button
          style={{ marginRight: 10 }}
          title="H2"
          onPress={() => {
            if (selection) {
              const text = value;
              const beforeChars = 4;
              const before = text.substring(0, selection.start);
              const current = text.substring(selection.start, selection.end);
              const after = text.substring(selection.end, text.length);
              const newText = `${before}\n## ${current}\n${after}`;
              onChange(newText);

              textInputRef.current?.focus();
              setTimeout(() => {
                setSelection({
                  start: selection.start + beforeChars,
                  end: selection.end + beforeChars,
                });
              }, 100);
            }
          }}
        />

        <Button
          title="H3"
          style={{ marginRight: 10 }}
          onPress={() => {
            if (selection) {
              const text = value;
              const beforeChars = 5;
              const before = text.substring(0, selection.start);
              const current = text.substring(selection.start, selection.end);
              const after = text.substring(selection.end, text.length);
              const newText = `${before}\n### ${current}\n${after}`;
              onChange(newText);

              textInputRef.current?.focus();
              setTimeout(() => {
                setSelection({
                  start: selection.start + beforeChars,
                  end: selection.end + beforeChars,
                });
              }, 100);
            }
          }}
        />

        <Button
          title="Link"
          style={{ marginRight: 10 }}
          onPress={() => {
            alertAlert(
              getText("fillInUrl"),
              getText("fillInUrlText"),
              [
                { text: getText("cancel") },
                {
                  text: getText("ok"),
                  onPress: (url) => {
                    const text = value;
                    const beforeChars = 1;
                    const before = text.substring(0, selection.start);
                    const current = text.substring(
                      selection.start,
                      selection.end
                    );
                    const after = text.substring(selection.end, text.length);
                    const newSelection = `[${
                      current.length > 0 ? current : getText("clickHere")
                    }](${url})`;
                    const newText = `${before}${newSelection}${after}`;
                    onChange(newText);

                    textInputRef.current?.focus();
                    setTimeout(() => {
                      setSelection({
                        start: selection.start + beforeChars,
                        end: selection.end + beforeChars,
                      });
                    }, 100);
                  },
                },
              ],
              { textInput: true }
            );
          }}
        />

        <Button
          title="Image"
          style={{ marginRight: 10 }}
          onPress={async () => {
            const path = await handleChoosePhoto();

            if (path) {
              const text = value;
              const beforeChars = 2;
              const before = text.substring(0, selection.start);
              const current = text.substring(selection.start, selection.end);
              const after = text.substring(selection.end, text.length);

              const newSelection = `![${
                current.length > 0 ? current : "image"
              }](${Constants.SERVER_ADDR + "/" + path})`;

              const newText = `${before}${newSelection}${after}`;
              onChange(newText);

              textInputRef.current?.focus();
              setTimeout(() => {
                setSelection({
                  start: selection.start + beforeChars,
                  end: selection.end + beforeChars,
                });
              }, 100);
            }
          }}
        />
      </View>
      <TextInput
        ref={textInputRef}
        selection={selection}
        placeholderTextColor={theme.secondaryTextSoft}
        style={[style(theme).textInput, { width: "100%", height: 200 }]}
        multiline={true}
        onSelectionChange={({ nativeEvent: { selection } }) => {
          if (selection.start !== 0 && selection.end !== 0) {
            console.log("selection", selection);
            setSelection(selection);
          }
        }}
        numberOfLines={4}
        value={value}
        onChangeText={(x) => onChange(x)}
      />
    </View>
  );
});

// MarkdownEditor.whyDidYouRender = { logOnDifferentValues: true };
// It does just render once on pageload! :D

export default MarkdownEditor;
