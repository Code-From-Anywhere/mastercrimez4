import NetInfo from "@react-native-community/netinfo";
import React from "react";
import { Platform, SafeAreaView, Text, View } from "react-native";
import { connect } from "react-redux";
import Constants from "../Constants";

const CONNECTION_GOOD = 2;
const CONNECTION_BAD = 1;
const CONNECTION_NONE = 0;

class ConnectionProviderScreen extends React.Component {
  componentDidMount() {
    if (Platform.OS !== "web") {
      this.unsubscribe = NetInfo.addEventListener((state) => {
        // console.log("Connection type", state.type);
        // console.log("Is connected?", state.isConnected);
        this.props.setIsConnected(
          state.isConnected ? CONNECTION_GOOD : CONNECTION_NONE
        );
      });
    }

    this.interval = setInterval(this.fetchWithTimeout, 5000);

    // To unsubscribe to these update, just use:
  }

  fetchWithTimeout = () => {
    const FETCH_TIMEOUT = 5000;
    let didTimeOut = false;

    new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error("Request timed out"));
      }, FETCH_TIMEOUT);

      fetch(Constants.SERVER_ADDR + "/healthcheck")
        .then(function (response) {
          // Clear the timeout as cleanup
          clearTimeout(timeout);
          if (!didTimeOut) {
            // console.log("fetch good! ");
            resolve(response);
          }
        })
        .catch(function (err) {
          // console.log("fetch failed! ", err);

          // Rejection already happened with setTimeout
          if (didTimeOut) return;
          // Reject with error
          reject(err);
        });
    })
      .then(() => {
        // Request success and no timeout
        this.props.setIsConnected(CONNECTION_GOOD);
      })
      .catch((err) => {
        console.log("err", err);
        this.props.setIsConnected(CONNECTION_BAD);
        // Error: response error, request timeout or runtime error
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
    clearTimeout(this.interval);
  }

  render() {
    const { children, isConnected } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {isConnected !== CONNECTION_GOOD && (
          <View
            style={{
              backgroundColor:
                isConnected === CONNECTION_BAD ? "orange" : "red",
              padding: 15,
            }}
          >
            <SafeAreaView>
              <Text style={{ color: "white" }}>
                {isConnected === CONNECTION_BAD ? "Slechte" : "Geen"}{" "}
                internetverbinding!
              </Text>
            </SafeAreaView>
          </View>
        )}
        {children}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  isConnected: state.device.isConnected,
});

const mapDispatchToProps = (dispatch) => ({
  setIsConnected: (isConnected) =>
    dispatch({ type: "SET_IS_CONNECTED", value: isConnected }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionProviderScreen);
