import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

export const useExpoUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  useEffect(() => {
    if (!__DEV__) {
      setUpdateListener();
      Updates.addListener(() => checkUpdate());
      checkUpdate();
    }
  }, []);

  const setUpdateListener = () => {
    Updates.addListener(() => checkUpdate());
  };
  const checkUpdate = () => {
    Updates.checkForUpdateAsync().then((res) => {
      if (res.isAvailable) {
        Updates.fetchUpdateAsync().then((res) => {
          setUpdateAvailable(true);
        });
      }
    });
  };

  return updateAvailable;
};
