import React, { useState } from "react";
import { Alert, Platform, Text, View } from "react-native";
import { getTextFunction } from "../Util";
import Button from "./Button";

export const AlertContext = React.createContext({});

export const AlertProvider = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alert, setAlert] = useState({});

  const getText = getTextFunction(); //TODO: Provide me?.locale
  return (
    <AlertContext.Provider
      value={(title, message, buttons, options) => {
        console.log("functie");
        if (Platform.OS === "web") {
          setAlertVisible(!alertVisible);
          setAlert({ title, message, buttons, options });
        } else {
          Alert.alert(title, message, buttons, options);
        }
      }}
    >
      {children}

      {alertVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{ backgroundColor: "white", borderRadius: 20, padding: 20 }}
          >
            <Text style={{ fontWeight: "bold" }}>{alert.title}</Text>
            <Text>{alert.message}</Text>

            {alert.buttons ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {alert.buttons.map((button) => (
                  <Button
                    title={button.text}
                    onPress={() => {
                      button.onPress?.();
                      setAlertVisible(false);
                    }}
                  />
                ))}
              </View>
            ) : (
              <Button
                title={getText("ok")}
                onPress={() => setAlertVisible(false)}
              />
            )}
          </View>
        </View>
      )}
    </AlertContext.Provider>
  );
};

// create the consumer as higher order component
export const withAlert = (ChildComponent) => (props) => (
  <AlertContext.Consumer>
    {(context) => <ChildComponent {...props} alert={context} />}
  </AlertContext.Consumer>
);
