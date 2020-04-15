import React from "react";

import { View } from "react-native";

function appendLeadingZeroes(n) {
  if (n <= 9) {
    return "0" + n;
  }
  return n;
}

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    const d = new Date(Date.now() + 86400000);
    const datetime =
      d.getFullYear() +
      "-" +
      appendLeadingZeroes(d.getMonth() + 1) +
      "-" +
      appendLeadingZeroes(d.getDate()) +
      "T20:00";

    this.state = {
      datetime
    };

    props.setFormState({ [props.field]: datetime });
  }

  render() {
    const { value, state, setFormState, field } = this.props;

    return (
      <View>
        <input
          type="datetime-local"
          id="meeting-time"
          name="meeting-time"
          value={this.state.datetime}
          //   min={Date.now()}
          onChange={x => {
            const d = x.target.value;
            this.setState({ datetime: d });
            setFormState({ [field]: d });
          }}
        />
      </View>
    );
  }
}

export default LocationSearchInput;
