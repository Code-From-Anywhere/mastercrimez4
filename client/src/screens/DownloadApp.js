const { Platform, Linking, View, Text } = require("react-native");
import React from "react";
import Constants from "../Constants";

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "windows";
  }

  if (/android/i.test(userAgent)) {
    return "android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }

  return "unknown";
}

const DownloadApp = () => {
  if (getMobileOperatingSystem() === "android") {
    console.log("is android");
    window.location.replace(Constants.ANDROID_APP_URL);
  }

  if (getMobileOperatingSystem() === "ios") {
    console.log("is ios");
    window.location.replace(Constants.IOS_APP_URL);
  }

  console.log(getMobileOperatingSystem());

  return (
    <View>
      <Text>Download the app!</Text>
    </View>
  );
};
export default DownloadApp;
