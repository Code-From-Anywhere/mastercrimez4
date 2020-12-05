import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { doOnce, get, getTextFunction, post } from "../../Util";
import Overlay from "./Overlay";
const citiesAreas = require("../../../assets/map/cities.json");

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const mapStyle = require("./mapStyle.json");
const API_KEY = "AIzaSyCOENphOkWqcrvmehHhhgKu7lJpwqfLQzc";

const OBJECT_SIZE_FACTOR = 4;
const SIZE_FACTOR = 100;

const rgbs = [
  "0,255,0",
  "255,0,0",
  "0,255,255",
  "0,0,255",
  "255,0,255",
  "255,255,0",
  "0,150,0",
  "0,0,150",
];

const decimalHash = (string) => {
  let sum = 0;
  for (let i = 0; i < string.length; i++)
    sum += ((i + 1) * string.codePointAt(i)) / (1 << 8);
  return sum % 1;
};

// kies positiegetal deterministisch aan de hand van een string van moment().format("DD-MM-YY HH") en index en type
const getPosition = (id, type) => {
  const string = moment().format("DD-MM-YY HH") + id?.toString() + type;
  return decimalHash(string);
};

const Territories = React.memo(
  ({ territories, MapsComponent, onPress, opacity }) => {
    // console.log("render territories");
    return territories.map(({ area, userId, gangId }, index) => {
      const number = gangId ? gangId : userId ? userId : 0;
      const rgb = !number ? "255,255,255" : rgbs[number % (rgbs.length - 1)];

      return (
        <MapsComponent.Polygon
          key={`polygon${index}`}
          onPress={() => onPress(index)}
          tappable
          coordinates={area}
          fillColor={`rgba(${rgb},${opacity})`}
        />
      );
    });
  }
);

const GameObjects = React.memo(
  ({
    city,
    object,
    index,
    dragAndDropMode,
    MapsComponent,
    selected,
    setSelected,
    reloadCities,
    cityAreas,
    level,
    myName,
    device,
    propertiesViewPagerRefContainer,
  }) => {
    let latitude = city?.[`${object.type}Latitude`];
    let longitude = city?.[`${object.type}Longitude`];

    if (!latitude || !longitude) {
      const terri = cityAreas.areas[index % (cityAreas.areas.length - 1)];
      latitude = terri.centerLatitude;
      longitude = terri.centerLongitude;
    }

    const deltaLatitude =
      (city?.delta * object.size) / object.aspectRatio / SIZE_FACTOR; //width
    const deltaLongitude = (city?.delta * object.size) / SIZE_FACTOR;

    const biggestDeltaLatitude =
      deltaLatitude > deltaLongitude ? deltaLatitude : deltaLongitude;
    const topLeftLatitude = latitude - deltaLatitude / 2;
    const topLeftLongitude = longitude - deltaLongitude / 2;
    const bottomRightLatitude = latitude + deltaLatitude / 2;
    const bottomRightLongitude = longitude + deltaLongitude / 2;

    const topRightLatitude = latitude + deltaLatitude / 2;
    const topRightLongitude = longitude - deltaLongitude / 2;
    const bottomLeftLatitude = latitude - deltaLatitude / 2;
    const bottomLeftLongitude = longitude + deltaLongitude / 2;

    const square = [
      { latitude: topLeftLatitude, longitude: topLeftLongitude },
      { latitude: topRightLatitude, longitude: topRightLongitude },
      {
        latitude: bottomRightLatitude,
        longitude: bottomRightLongitude,
      },
      { latitude: bottomLeftLatitude, longitude: bottomLeftLongitude },
    ];

    return dragAndDropMode ? (
      <MapsComponent.Marker
        draggable={level >= 5}
        onDragEnd={async ({ nativeEvent: { coordinate } }) => {
          const { response, success } = await post("moveBuilding", {
            loginToken: device.loginToken,
            type: object.type,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
          });
          reloadCities();
          if (!success) {
            Alert.alert(response);
          }
        }}
        key={`object${index}`}
        coordinate={{ latitude, longitude }}
      >
        <Animated.Image
          source={object.image}
          style={{
            width: object.animated,
            height: object.animated,
          }}
          resizeMode="contain"
        />
      </MapsComponent.Marker>
    ) : (
      <>
        {selected === object.type ? (
          <MapsComponent.Circle
            key={`circle${index}${selected}`}
            center={{ latitude, longitude }}
            radius={biggestDeltaLatitude * 50000}
            fillColor={"rgba(0,0,0,0.5)"}
          />
        ) : city?.[`${object.type}Owner`] === myName ? (
          <MapsComponent.Circle
            key={`circle${index}${selected}`}
            center={{ latitude, longitude }}
            radius={biggestDeltaLatitude * 50000}
            fillColor={"rgba(0,255,0,0.5)"}
          />
        ) : null}

        <MapsComponent.Overlay
          key={`overlay${index}${selected}`} //add selected to the key to ensure rerender after selected changes
          image={object.image}
          //dont use onpress on the overlay because it only works on android. use an invisible polygon instead at the same location
          // tappable
          // onPress={() => navigation.navigate(object.to)}
          bounds={[
            [topLeftLatitude, topLeftLongitude],
            [bottomRightLatitude, bottomRightLongitude],
          ]}
        />

        <MapsComponent.Polygon
          key={`overlayPolygon${index}`}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

            selected === object.type
              ? setSelected(null)
              : setSelected(object.type);

            propertiesViewPagerRefContainer?.current?.setPage(index + 1);
          }}
          tappable
          coordinates={square}
          zIndex={2}
          strokeWidth={0.00001}
          // fillColor={`rgba(${rgb},${opacity})`}
        />
      </>
    );
  }
);

const Map = ({
  navigation,
  screenProps: {
    device,
    cities,
    reloadCities,
    me,
    ocs,
    reloadMe,
    streetraces,
    robberies,
    reloadStreetraces,
    reloadOcs,
    reloadRobberies,
  },
}) => {
  const [dragAndDropMode, setDragAndDropMode] = useState(false);

  const [selected, setSelected] = useState(null);
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(null); //index

  const [map, setMap] = useState(null);
  const [view, setView] = useState("game");
  const [areas, setAreas] = useState([]);
  const [region, setRegion] = useState({
    latitude: 52.378, //amsterdam
    longitude: 4.89707,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  doOnce(reloadCities);

  doOnce(() => reloadOcs(device.loginToken));
  doOnce(reloadStreetraces);
  doOnce(reloadRobberies);

  const getAreas = async () => {
    const { areas } = await get(`areas?city=${me?.city}`);
    setAreas(areas);
  };
  useEffect(() => {
    console.log("getAreas");
    getAreas();
  }, [me?.city]);

  const window = Dimensions.get("window");
  const city = cities?.find((x) => x.city === me?.city);
  const cityAreas = citiesAreas.find((x) => x.city === me?.city);

  useEffect(() => {
    const reg = {
      latitude: city?.latitude, //amsterdam
      longitude: city?.longitude,
      latitudeDelta: city?.delta,
      longitudeDelta: city?.delta,
    };
    setRegion(reg);
    if (map) {
      map.animateToRegion(reg);
      //map.fitToElements(true);
    }
  }, [city, map]);

  //useEffect(() => {
  //map?.fitToElements(true);
  //}, [view]);

  const getText = getTextFunction(me?.locale);

  const objects = [
    {
      title: getText("menuBulletfactory"),
      type: "bulletFactory",
      to: "AllBulletfactory",
      image: require("../../../assets/map/bulletfactory.png"),
      size: 10,
      aspectRatio: 1,
    },
    {
      title: getText("menuAirport"),
      type: "airport",
      to: "AllAirport",
      image: require("../../../assets/map/airport.png"),
      size: 15,
      aspectRatio: 1,
    },

    {
      title: getText("menuBank"),
      type: "bank",
      to: "AllBanks",
      image: require("../../../assets/map/bank.png"),
      size: 8,
      aspectRatio: 200 / 235,
    },

    {
      title: getText("menuCasino"),
      type: "casino",
      to: "Casino",
      image: require("../../../assets/map/casino.png"),
      size: 20,
      aspectRatio: 400 / 251,
    },

    {
      title: getText("menuCoffeeShop"),
      type: "landlord",
      to: "Wiet",
      image: require("../../../assets/map/coffeeshop.png"),
      size: 10,
      aspectRatio: 300 / 270,
    },

    {
      title: getText("menuSalvationArmy"),
      type: "junkies",
      to: "Junkies",
      image: require("../../../assets/map/junkies.png"),
      size: 10,
      aspectRatio: 1,
    },

    {
      title: getText("menuGarage"),
      type: "garage",
      to: "AllGarage",
      image: require("../../../assets/map/garage.png"),
      size: 10,
      aspectRatio: 400 / 292,
    },

    {
      title: getText("menuGym"),
      type: "gym",
      to: "Gym",
      image: require("../../../assets/map/gym.png"),
      size: 10,
      aspectRatio: 300 / 231,
    },

    {
      title: getText("menuHospital"),
      type: "hospital",
      to: "Hospital",
      image: require("../../../assets/map/hospital.png"),
      size: 10,
      aspectRatio: 300 / 270,
    },

    {
      title: getText("menuHouse"),
      type: "house",
      to: "House",
      image: require("../../../assets/map/house2.png"),
      size: 10,
      aspectRatio: 783 / 500,
    },

    {
      title: getText("menuHeadquarter"),
      type: "headquarter",
      to: "AllGang",
      image: require("../../../assets/map/headquarter.png"),
      size: 10,
      aspectRatio: 202 / 182,
    },

    {
      title: getText("menuJail2"),
      type: "jail",
      to: "Jail",
      image: require("../../../assets/map/jail.png"),
      size: 10,
      aspectRatio: 1,
    },

    {
      title: getText("menuMarket"),
      type: "market",
      to: "Market",
      image: require("../../../assets/map/market.png"),
      size: 10,
      aspectRatio: 1,
    },
    {
      title: getText("menuWeaponShop"),
      type: "weaponShop",
      to: "Shop",
      image: require("../../../assets/map/shop.png"),
      size: 10,
      aspectRatio: 300 / 262,
    },

    {
      title: getText("menuEstateAgent"),
      type: "estateAgent",
      to: "EstateAgent",
      image: require("../../../assets/map/shop.png"),
      size: 10,
      aspectRatio: 300 / 262,
    },

    {
      title: getText("menuRLD"),
      type: "rld",
      to: "Hoeren",
      image: require("../../../assets/map/sexshop.png"),
      size: 10,
      aspectRatio: 1,
    },

    {
      title: getText("menuStockExchange"),
      type: "stockExchange",
      to: "StockExchange",
      image: require("../../../assets/map/market.png"),
      size: 10,
      aspectRatio: 1,
    },
  ];
  const territories = cityAreas.areas.map((area) => {
    const connectedArea = areas?.find((x) => x.code === area.code);

    return {
      ...area,
      userId: connectedArea?.userId,
      gangId: connectedArea?.gangId || connectedArea?.user?.gangId,
    };
  });

  const MapsComponent = Platform.select({
    native: () => require("react-native-maps").default,
    web: () => require("google-map-react").default,
  })();

  const crimeIcons = [
    {
      inactive: me?.autostelenAt + 60000 - Date.now() > 0,
      to: "StealCar",
      icon: "🚘",
      type: "stealcar",
    },

    {
      inactive: me?.crimeAt + 60000 - Date.now() > 0,
      to: "Crimes",
      icon: "💰",
      type: "crimes",
    },

    {
      inactive: me?.junkiesAt + 120000 - Date.now() > 0,
      to: "Junkies",
      icon: "🧔",
      type: "junkies",
    },

    {
      inactive: me?.hoerenAt + 120000 - Date.now() > 0,
      to: "Hoeren",
      icon: "💃",
      type: "hoeren",
    },
    {
      inactive: me?.workEndsAt - Date.now() > 0,
      to: "Work",
      icon: "🛠",
      type: "work",
    },

    {
      inactive: me?.wietAt + 120000 - Date.now() > 0,
      to: "Wiet",
      icon: "🌳",
      type: "wiet",
    },
  ].filter((x) => !x.inactive);

  const ocIcons = ocs
    ?.filter((x) => x.city === me?.city)
    .map((oc) => ({
      icon: "🔥",
      type: "oc",
      to: "OC",
      id: oc.id,
      params: { id: oc.id },
    }));
  const streetraceIcons = streetraces
    ?.filter((x) => x.city === me?.city)
    .map((x) => ({
      icon: "🛣",
      type: "streetrace",
      id: x.id,
      to: "Streetrace",
      params: { id: x.id },
    }));

  const robberyIcons = robberies
    ?.filter((x) => x.city === me?.city)
    .map((x) => ({
      icon: "🚨",
      type: "robbery",
      to: "Robbery",
      id: x.id,
      params: { id: x.id },
    }));

  const icons = crimeIcons
    .concat(ocIcons)
    .concat(streetraceIcons)
    .concat(robberyIcons)
    .filter((x) => !!x);

  const territoriesViewPagerRefContainer = useRef(null);
  const propertiesViewPagerRefContainer = useRef(null);

  const renderMapsComponent = () => {
    const objectsWithAnimated = objects.map((object) => ({
      ...object,
      animated: useRef(
        new Animated.Value(
          (city?.delta * OBJECT_SIZE_FACTOR * object.size) /
            region.latitudeDelta
        )
      ).current,
    }));

    const renderCrimes = icons.map((icon, index) => {
      const position = getPosition(icon.id, icon.type); //0-1

      const areaIndex = Math.floor(cityAreas.areas.length * position);

      const area = cityAreas.areas[areaIndex];

      const pseudoRandom = (x, y) => x + position * (y - x);

      const latitude = pseudoRandom(
        area.centerLatitude - area.latitudeDelta / 2,
        area.centerLatitude + area.latitudeDelta / 2
      );
      const longitude = pseudoRandom(
        area.centerLongitude - area.longitudeDelta / 2,
        area.centerLongitude + area.longitudeDelta / 2
      );

      //random positions on the first territorium
      return (
        <MapsComponent.Marker
          key={`icon${index}`}
          onPress={() => navigation.navigate(icon.to)}
          coordinate={{ latitude, longitude }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>{icon.icon}</Text>
          </View>
        </MapsComponent.Marker>
      );
    });

    const renderTerritories = (
      <Territories
        opacity={view === "territories" ? 0.4 : 0.2}
        onPress={
          view === "territories"
            ? (index) => {
                setSelected("area");
                setSelectedAreaIndex(index);
                territoriesViewPagerRefContainer?.current?.setPage(index + 1);
              }
            : () => null
        }
        territories={territories}
        MapsComponent={MapsComponent}
      />
    );

    const renderGame = objectsWithAnimated.map((object, index) => {
      return (
        <GameObjects
          key={`game${index}`}
          propertiesViewPagerRefContainer={propertiesViewPagerRefContainer}
          MapsComponent={MapsComponent}
          city={city}
          dragAndDropMode={dragAndDropMode}
          object={object}
          index={index}
          selected={selected}
          cityAreas={cityAreas}
          setSelected={setSelected}
          reloadCities={reloadCities}
          level={me?.level}
          device={device}
          myName={me?.name}
        />
      );
    });

    return (
      <MapsComponent
        // provider={PROVIDER_GOOGLE}
        customMapStyle={Platform.OS === "android" ? mapStyle : undefined}
        ref={(map) => setMap(map)}
        initialRegion={region}
        onRegionChange={(r) => {
          setRegion(r);
          objectsWithAnimated.forEach((object) => {
            Animated.timing(object.animated, {
              toValue:
                (city?.delta * OBJECT_SIZE_FACTOR * object.size) /
                r.latitudeDelta,
              duration: 100,
              useNativeDriver: false,
            }).start();
          });
        }}
        style={StyleSheet.absoluteFill}
      >
        {(view === "all" ||
          view === "territories" ||
          view === "game" ||
          view === "crimes") &&
          renderTerritories}
        {/* NB: areas.length moet geladen zijn voor renderGame, anders rendert hij de teritoriums over de game heen */}
        {(view === "all" || view === "game") && areas.length > 0 && renderGame}

        {(view === "all" || view === "crimes") && renderCrimes}
      </MapsComponent>
    );
  };

  return Platform.OS === "web" ? (
    <MapsComponent
      bootstrapURLKeys={{ key: API_KEY }}
      defaultCenter={{
        lat: city?.latitude,
        lng: city?.longitude,
      }}
      defaultZoom={11}
    >
      {/* <Bulletfactory lat={city?.latitude} lng={city?.longitude} /> */}
    </MapsComponent>
  ) : (
    <View style={{ flex: 1 }}>
      {renderMapsComponent()}

      <Overlay
        getAreas={getAreas}
        map={map}
        view={view}
        setView={setView}
        selected={selected}
        setSelected={setSelected}
        setSelectedAreaIndex={setSelectedAreaIndex}
        selectedAreaIndex={selectedAreaIndex}
        device={device}
        me={me}
        dragAndDropMode={dragAndDropMode}
        setDragAndDropMode={setDragAndDropMode}
        territoriesViewPagerRefContainer={territoriesViewPagerRefContainer}
        propertiesViewPagerRefContainer={propertiesViewPagerRefContainer}
        cityAreas={cityAreas}
        areas={areas}
        navigation={navigation}
        city={city}
        objects={objects}
        reloadMe={reloadMe}
        reloadCities={reloadCities}
      />
    </View>
  );
};

export default Map;
