import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import T from "../components/T";

class MyProfile extends React.Component {
  state = {
    response: null,
  };
  render() {
    const {
      navigation,
      screenProps: { device, me, dispatch },
    } = this.props;

    if (!me) {
      return <ActivityIndicator />;
    }

    return (
      <ScrollView>
        <View style={{ margin: 20 }}>
          {this.state.response ? <T>{this.state.response.response}</T> : null}
          {/* 
          coming soon
          
          <DataForm
            navigation={navigation}
            fields={[
              {
                field: "name",
                title: "Je naam",
                type: "text",
              },
            ]}
            onComplete={(data) => {
              console.log("data", data);
            }}
            //here you can put a graphql or redux mutation
            mutate={(vars) => {
              return fetch(`${Constants.SERVER_ADDR}/updateName`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...vars,
                  loginToken: device.loginToken,
                }),
              })
                .then((response) => response.json())
                .then(async (responseJson) => {
                  this.props.screenProps.reloadMe(device.loginToken);
                  this.setState({ response: responseJson });
                  return responseJson;
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
            values={{
              ...me,
            }}
          /> */}
        </View>
      </ScrollView>
    );
  }
}

export default MyProfile;
