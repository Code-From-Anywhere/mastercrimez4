import React from "react";

import { inputs, FieldComponent } from "expo-inputs";
import { Component as _DataForm, Field } from "expo-data-forms";
import DateTimePickerReact from "../components/DateTimePickerReact";
//this is needed for image upload
const firebaseConfig = {
  apiKey: "?",
  authDomain: "?",
  databaseURL: "?",
  projectId: "?",
  storageBucket: "?",
  messagingSenderId: "?"
};

//this is needed for the location type
const googlePlacesConfig = {
  key: "?"
};

const DataForm = props => {
  //initialize our input types with the props they need
  const leckrInputs = inputs({
    firebaseConfig,
    googlePlacesConfig,
    navigation: props.navigation
  });

  const inputTypes = {
    ...leckrInputs,
    DateTimePickerReact
    //add your own custom types
  };

  const allProps = {
    ...props,
    inputTypes,
    FieldComponent
  };

  return <_DataForm {...allProps} />;
};

export { DataForm, Field };
