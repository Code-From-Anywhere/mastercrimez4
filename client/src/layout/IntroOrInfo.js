import React, { useEffect } from "react";
import { getTextFunction } from "../Util";
import Guy from "./Guy";

const IntroOrInfo = ({ screenProps: { dispatch, device, me } }) => {
  const getText = getTextFunction(me?.locale);

  useEffect(() => {
    if (intros[device.introLevel]?.shouldOpen()) {
      dispatch({ type: "SET_GUY_VISIBLE", value: true });
    }
  }, [device.introLevel]);
  /*
    deze guy moet visible worden als je iets gedaan hebt. dat kan een actie zijn die aan de backend of frontend geferifieerd wordt. 

    wat ik wil doen in de demo:
    - welcome 
    - choose name
    - choose city
    */
  const upLevel = () => {
    dispatch({ type: "UP_INTRO_LEVEL" });
  };

  const intros = [
    //0=welcome
    // open map on zoomlevel 0
    {
      text: getText("intro0"),
      onClose: () => upLevel(),
      shouldOpen: () => true,
    },

    //1=choose name
    {
      text: getText("intro1"),
      button: getText("intro1button"),
      onClose: () => {
        dispatch({ type: "SET_LOGGED", value: false });
        dispatch({ type: "SET_GUY_VISIBLE", value: false });
        //open name alert. when logged in, up level.
      },
      shouldOpen: () => true,
    },

    //2=choose city
    {
      text: getText("intro2", me?.name),
      button: getText("intro2button"),
      onClose: () => {
        dispatch({ type: "SET_GUY_VISIBLE", value: false });
        // open nothing, just let the user choose a city like traveling.
        // when a city is chosen, animate to that city, up level
      },
      shouldOpen: () => true,
    },

    //3=welcome to city
    {
      text: getText("intro3", me?.city, me?.name),
      onClose: () => {
        upLevel();
      },
      shouldOpen: () => true,
    },
  ];

  const intro = intros[device.introLevel];

  let text = device.guyText;
  let button = null;
  if (intro) {
    text = intro?.text;
    button = intro?.button;
  }

  return (
    <Guy
      button={button}
      text={text}
      onClose={
        intros[device.introLevel]?.onClose ||
        (() => dispatch({ type: "SET_GUY_VISIBLE", value: false }))
      }
      visible={device.guyVisible}
    />
  );
};

export default IntroOrInfo;
