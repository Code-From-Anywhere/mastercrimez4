import React, { useEffect, useState } from "react";
import { post } from "../Util";

export const IntervalContext = React.createContext({});
export const IntervalProvider = ({
  children,
  screenProps: { me, dispatch, device, reloadMe },
}) => {
  const [token, setToken] = useState(device.loginToken);

  useEffect(() => {
    if (token) {
      const intervalReloadMe = setInterval(() => {
        // console.log("This will run every 5 seconds! TOKEN:", token);
        reloadMe(device.loginToken);
      }, 5000);

      const intervalMovements = setInterval(() => {
        // console.log("This will run every 60 seconds! TOKEN:");
        sendMovements();
      }, 60000);

      return () => {
        // console.log("clearing interval because token changed");
        clearInterval(intervalReloadMe);
        clearInterval(intervalMovements);
      };
    }
  }, [token]);

  const sendMovements = () => {
    // console.log("sendMovements", device.loginToken);
    if (device.movements.length > 0) {
      post("movementsApp", {
        loginToken: device.loginToken,
        movements: device.movements,
      });
      dispatch({ type: "CLEAR_MOVEMENTS" });
    }
  };

  return (
    <IntervalContext.Provider
      value={{
        resetIntervalsForToken: (token) => setToken(token),
      }}
    >
      {children}
    </IntervalContext.Provider>
  );
};

// create the consumer as higher order component
export const withInterval = (ChildComponent) => (props) => (
  <IntervalContext.Consumer>
    {(context) => <ChildComponent {...props} intervals={context} />}
  </IntervalContext.Consumer>
);
