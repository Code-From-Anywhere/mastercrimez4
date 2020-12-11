import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import md5 from "react-native-md5";
import Constants from "../Constants";
import style from "../Style";
import { getTextFunction, post } from "../Util";
import Button from "./Button";
import { IntervalContext } from "./IntervalProvider";
import T from "./T";

const LoginModal = ({
  screenProps: {
    dispatch,
    me,
    device,
    reloadMe,
    device: { theme },
  },
  navigation,
}) => {
  const getText = getTextFunction(me?.locale);
  const [name, setName] = useState(me?.name);
  const [response, setResponse] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [phone, setPhone] = useState("");
  const [view, setView] = useState(null);
  const [code, setCode] = useState("");
  const changeName = async () => {
    const { response, success } = await post("updateName", {
      loginToken: device.loginToken,
      name,
    });
    setResponse(response);

    return success;
  };

  const login = () => {
    dispatch({ type: "SET_LOGGED", value: true });
    if (device.introLevel === 1) {
      dispatch({ type: "UP_INTRO_LEVEL" });
    }
  };
  useEffect(() => {
    setName(me?.name);
  }, [me?.name]);

  const { resetIntervalsForToken } = React.useContext(IntervalContext);
  const postVerifyPhone = () => {
    fetch(`${Constants.SERVER_ADDR}/verifyPhone`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        phone,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setResponse(responseJson.response);

        if (responseJson.success) {
          dispatch({
            type: "SET_LOGIN_TOKEN_AND_LOGIN",
            value: responseJson.token,
          });

          reloadMe(responseJson.loginToken);
          resetIntervalsForToken(responseJson.token);
        }
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const postLogin = () => {
    fetch(`${Constants.SERVER_ADDR}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: md5.str_md5(password) }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.error) {
          setError(responseJson.error);
        } else {
          //go to map
          dispatch({
            type: "SET_LOGIN_TOKEN_AND_LOGIN",
            value: responseJson.loginToken,
          });
          reloadMe(responseJson.loginToken);
          setError(null);
          setSuccess(responseJson.success);
          resetIntervalsForToken(responseJson.token);
        }

        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const postSetPhone = () => {
    fetch(`${Constants.SERVER_ADDR}/setPhone`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, token: device.loginToken }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setResponse(responseJson.response);

        if (responseJson.success) {
          setView("code");
        }
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderEmailPassLogin = () => (
    <View>
      <View
        style={{
          margin: 20,
          padding: 20,
          borderRadius: 20,
        }}
      >
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

        {success ? (
          <Text style={{ color: "green" }}>{success}</Text>
        ) : (
          <View>
            <View
              style={{
                padding: 10,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 20 }}>{getText("email")}</Text>

              <TextInput
                placeholder={getText("email")}
                placeholderTextColor={theme.secondaryTextSoft}
                onChangeText={setEmail}
                value={email}
                style={style(theme).textInput}
              />
            </View>

            <View
              style={{
                padding: 10,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 20 }}>{getText("password")}</Text>

              <TextInput
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                style={style(theme).textInput}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
              }}
            >
              <View />

              <Button
                theme={theme}
                title={getText("login")}
                onPress={() => postLogin()}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                padding: 10,
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  login();

                  navigation.navigate("SignupEmail");
                }}
              >
                <Text
                  style={{
                    margin: 20,
                    fontSize: 20,
                    textDecorationLine: "underline",
                  }}
                >
                  {getText("register")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  login();
                  navigation.navigate("ForgotPassword");
                }}
              >
                <Text
                  style={{
                    margin: 20,
                    fontSize: 20,
                    textDecorationLine: "underline",
                  }}
                >
                  {getText("forgotPassword")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
  const renderCode = () => (
    <View>
      {response && <T>{response}</T>}
      <View
        style={{
          padding: 10,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: theme.primaryText }}>{getText("code")}</Text>

        <TextInput
          placeholder="000000"
          placeholderTextColor={theme.secondaryTextSoft}
          onChangeText={setCode}
          value={code}
          style={style(theme).textInput}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
        }}
      >
        <View />

        <Button title={getText("validate")} onPress={() => postVerifyPhone()} />
      </View>
    </View>
  );
  const renderPhoneLogin = () => (
    <View>
      {response && <T>{response}</T>}

      <View
        style={{
          padding: 10,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20 }}>{getText("phoneNumber")}</Text>
        <TextInput
          placeholder="+31"
          placeholderTextColor={theme.secondaryTextSoft}
          onChangeText={setPhone}
          value={phone}
          style={style(theme).textInput}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
        }}
      >
        <View />

        <Button
          theme={theme}
          title={getText("save")}
          onPress={() => postSetPhone()}
        />
      </View>
    </View>
  );
  const renderMain = () => (
    <View>
      {/* Option 1: Just play */}
      {response && <T>{response}</T>}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <T>{getText("youAre")}</T>
        <TextInput
          placeholderTextColor={theme.secondaryTextSoft}
          style={[style(theme).textInput, { marginLeft: 10 }]}
          placeholder={getText("name")}
          value={name}
          onChangeText={setName}
        />
      </View>
      <Button
        style={{ marginVertical: 10 }}
        title={getText("justPlay")}
        onPress={async () => {
          if (!me) {
            setResponse(getText("waitUntilLoaded"));
            return;
          }
          if (name !== me?.name) {
            const success = await changeName();
            if (success) {
              reloadMe(device.loginToken);

              login();
            }
          } else {
            login();
          }
        }}
      />
      {/* Option 2: Login with email */}
      <Button
        style={{ marginVertical: 10 }}
        title={getText("loginWithEmail")}
        onPress={() => setView("emailPass")}
      />
      {/* Option 3: Login with phone number */}
      <Button
        style={{ marginVertical: 10 }}
        title={getText("loginWithPhone")}
        onPress={() => setView("phone")}
      />
    </View>
  );

  return (
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
        style={{
          backgroundColor: theme.primary,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <TouchableOpacity
          onPress={view !== null ? () => setView(null) : login}
          style={{ alignSelf: "flex-end" }}
        >
          <Entypo name="cross" color={theme.primaryText} size={24} />
        </TouchableOpacity>

        {!me?.id ? <ActivityIndicator /> : null}

        {view === "emailPass"
          ? renderEmailPassLogin()
          : view === "phone"
          ? renderPhoneLogin()
          : view === "code"
          ? renderCode()
          : renderMain()}
      </View>
    </View>
  );
};

export default LoginModal;
