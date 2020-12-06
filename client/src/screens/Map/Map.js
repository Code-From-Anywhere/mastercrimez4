import {
  Circle,
  GoogleMap,
  GroundOverlay,
  LoadScript,
  OverlayView,
  Polygon,
} from "@react-google-maps/api";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import T from "../../components/T";
import { doOnce, get, post } from "../../Util";
import Overlay, { getZoom } from "./Overlay";
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

const objects = [
  {
    title: "menuBulletfactory",
    type: "bulletFactory",
    to: "AllBulletfactory",
    image: require("../../../assets/map/bulletfactory.png"),
    size: 10,
    aspectRatio: 1,
  },
  {
    title: "menuAirport",
    type: "airport",
    to: "AllAirport",
    image: require("../../../assets/map/airport.png"),
    size: 15,
    aspectRatio: 1,
  },

  {
    title: "menuBank",
    type: "bank",
    to: "AllBanks",
    image: require("../../../assets/map/bank.png"),
    size: 8,
    aspectRatio: 200 / 235,
  },

  {
    title: "menuCasino",
    type: "casino",
    to: "Casino",
    image: require("../../../assets/map/casino.png"),
    size: 20,
    aspectRatio: 400 / 251,
  },

  {
    title: "menuCoffeeShop",
    type: "landlord",
    to: "Wiet",
    image: require("../../../assets/map/coffeeshop.png"),
    size: 10,
    aspectRatio: 300 / 270,
  },

  {
    title: "menuSalvationArmy",
    type: "junkies",
    to: "Junkies",
    image: require("../../../assets/map/junkies.png"),
    size: 10,
    aspectRatio: 1,
  },

  {
    title: "menuGarage",
    type: "garage",
    to: "AllGarage",
    image: require("../../../assets/map/garage.png"),
    size: 10,
    aspectRatio: 400 / 292,
  },

  {
    title: "menuGym",
    type: "gym",
    to: "Gym",
    image: require("../../../assets/map/gym.png"),
    size: 10,
    aspectRatio: 300 / 231,
  },

  {
    title: "menuHospital",
    type: "hospital",
    to: "Hospital",
    image: require("../../../assets/map/hospital.png"),
    size: 10,
    aspectRatio: 300 / 270,
  },

  {
    title: "menuHouse",
    type: "house",
    to: "House",
    image: require("../../../assets/map/house2.png"),
    size: 10,
    aspectRatio: 783 / 500,
  },

  {
    title: "menuHeadquarter",
    type: "headquarter",
    to: "AllGang",
    image: require("../../../assets/map/headquarter.png"),
    size: 10,
    aspectRatio: 202 / 182,
  },

  {
    title: "menuJail2",
    type: "jail",
    to: "Jail",
    image: require("../../../assets/map/jail.png"),
    size: 10,
    aspectRatio: 1,
  },

  {
    title: "menuMarket",
    type: "market",
    to: "Market",
    image: require("../../../assets/map/market.png"),
    size: 10,
    aspectRatio: 1,
  },
  {
    title: "menuWeaponShop",
    type: "weaponShop",
    to: "Shop",
    image: require("../../../assets/map/shop.png"),
    size: 10,
    aspectRatio: 300 / 262,
  },

  {
    title: "menuEstateAgent",
    type: "estateAgent",
    to: "EstateAgent",
    image: require("../../../assets/map/shop.png"),
    size: 10,
    aspectRatio: 300 / 262,
  },

  {
    title: "menuRLD",
    type: "rld",
    to: "Hoeren",
    image: require("../../../assets/map/sexshop.png"),
    size: 10,
    aspectRatio: 1,
  },

  {
    title: "menuStockExchange",
    type: "stockExchange",
    to: "StockExchange",
    image: require("../../../assets/map/market.png"),
    size: 10,
    aspectRatio: 1,
  },
];

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

const containerStyle = {
  width: "100%",
  height: "100%",
};

const ReactMap = React.memo(({ zoom, setMap, children, setMapReady }) => {
  console.log("zoom...", zoom);
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
    setMapReady(true);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom}
        initialZoom={zoom}
        //center={{ lat: city?.latitude, lng: city?.longitude }}
        onLoad={onLoad}
        options={{ disableDefaultUI: true }}
        onUnmount={onUnmount}
      >
        {children}
      </GoogleMap>
    </LoadScript>
  );
});

const Territories = React.memo(
  ({ territories, MapsComponent, onPress, opacity }) => {
    return territories.map(({ area, userId, gangId }, index) => {
      const number = gangId ? gangId : userId ? userId : 0;
      const rgb = !number ? "255,255,255" : rgbs[number % (rgbs.length - 1)];
      const key = `polygon${index}`;
      const onClick = () => onPress(index);
      const fillColor = `rgba(${rgb},${opacity})`;
      return Platform.OS === "web" ? (
        <Polygon
          key={key}
          onClick={onClick}
          path={area.map((x) => ({ lat: x.latitude, lng: x.longitude }))}
          options={{ fillColor }}
        />
      ) : (
        <MapsComponent.Polygon
          key={key}
          onPress={onClick}
          tappable
          coordinates={area}
          fillColor={fillColor}
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
    isSelected,
    setSelected,
    reloadCities,
    cityAreas,
    level,
    myName,
    device,
    propertiesSwiperRefContainer,
  }) => {
    // console.log("RENDER GAME OBJECT", index);
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

    const draggable = level >= 5;
    const onDragEnd = async ({ nativeEvent: { coordinate } }) => {
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
    };

    const image = dragAndDropMode ? (
      <Animated.Image
        source={object.image}
        style={{
          width: object.animated,
          height: object.animated,
        }}
        resizeMode="contain"
      />
    ) : null;

    const onPressObject = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

      isSelected ? setSelected(null) : setSelected(object.type);

      propertiesSwiperRefContainer?.current?.goTo(index + 1);
    };

    const bounds = {
      east: bottomRightLongitude,
      south: bottomLeftLatitude,
      north: bottomRightLatitude,
      west: topRightLongitude,
    };

    const platformBounds =
      Platform.OS === "ios"
        ? [
            [topLeftLatitude, topLeftLongitude],
            [bottomRightLatitude, bottomRightLongitude],
          ]
        : [
            [bottomRightLatitude, topLeftLongitude],
            [topLeftLatitude, bottomRightLongitude],
          ];

    // console.log("BOUNDS", bounds);
    return Platform.OS === "web" ? (
      <>
        {isSelected ? (
          <Circle
            key={`circle${index}${isSelected}`}
            center={{ lat: latitude, lng: longitude }}
            radius={biggestDeltaLatitude * 50000}
            options={{ fillColor: "rgba(0,0,0,0.5)" }}
          />
        ) : city?.[`${object.type}Owner`] === myName ? (
          <Circle
            key={`circle${index}${isSelected}`}
            center={{ lat: latitude, lng: longitude }}
            radius={biggestDeltaLatitude * 50000}
            options={{ fillColor: "rgba(0,255,0,0.5)" }}
          />
        ) : null}

        <GroundOverlay
          onClick={onPressObject}
          key={`overlay${index}${isSelected}`} //add selected to the key to ensure rerender after selected changes
          url={object.image}
          //dont use onpress on the overlay because it only works on android. use an invisible polygon instead at the same location
          // tappable
          // onPress={() => navigation.navigate(object.to)}
          bounds={bounds}
        />
      </>
    ) : dragAndDropMode ? (
      <MapsComponent.Marker
        draggable={draggable}
        onDragEnd={onDragEnd}
        key={`object${index}`}
        coordinate={{ latitude, longitude }}
      >
        {image}
      </MapsComponent.Marker>
    ) : (
      <>
        {isSelected ? (
          <MapsComponent.Circle
            key={`circle${index}${isSelected}`}
            center={{ latitude, longitude }}
            radius={biggestDeltaLatitude * 50000}
            fillColor={"rgba(0,0,0,0.5)"}
          />
        ) : city?.[`${object.type}Owner`] === myName ? (
          <MapsComponent.Circle
            key={`circle${index}${isSelected}`}
            center={{ latitude, longitude }}
            radius={biggestDeltaLatitude * 50000}
            fillColor={"rgba(0,255,0,0.5)"}
          />
        ) : null}

        <MapsComponent.Overlay
          zIndex={1} //works for android to render it over the areas
          key={`overlay${index}${isSelected}`} //add selected to the key to ensure rerender after selected changes
          image={object.image}
          //dont use onpress on the overlay because it only works on android. use an invisible polygon instead at the same location
          // tappable
          // onPress={() => navigation.navigate(object.to)}
          bounds={platformBounds}
        />

        <MapsComponent.Polygon
          key={`overlayPolygon${index}`}
          onPress={onPressObject}
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

// GameObjects.whyDidYouRender = true;

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
  const city = React.useMemo(() => cities?.find((x) => x.city === me?.city), [
    cities,
    me?.city,
  ]);
  const [mapReady, setMapReady] = useState(false);

  const [zoom, setZoom] = useState(getZoom(city?.delta));
  const territoriesSwiperRefContainer = useRef(null);
  const propertiesSwiperRefContainer = useRef(null);

  doOnce(reloadCities);

  doOnce(() => reloadOcs(device.loginToken));
  doOnce(reloadStreetraces);
  doOnce(reloadRobberies);

  const getAreas = useCallback(() => {
    get(`areas?city=${me?.city}`).then(({ areas }) => setAreas(areas));
  }, []);
  useEffect(() => {
    console.log("getAreas");
    getAreas();
  }, [me?.city]);

  useEffect(() => {
    if (mapReady && city) {
      console.log("set zoom", city?.zoom);
      setTimeout(() => {
        setZoom(city?.zoom);
      }, 1000);
    }
  }, [city, mapReady]);

  const window = Dimensions.get("window");

  const cityAreas = citiesAreas.find((x) => x.city === me?.city);

  const objectsWithAnimated = objects.map((object) => ({
    ...object,
    animated: useRef(
      new Animated.Value(
        (city?.delta * OBJECT_SIZE_FACTOR * object.size) / region.latitudeDelta
      )
    ).current,
  }));

  useEffect(() => {
    if (map && city && mapReady) {
      const reg = {
        latitude: city?.latitude, //amsterdam
        longitude: city?.longitude,
        latitudeDelta: city?.delta,
        longitudeDelta: city?.delta,
      };
      setRegion(reg);

      if (Platform.OS === "web") {
        console.log("panToCity");
        map.panTo({ lat: city?.latitude, lng: city?.longitude });
      } else {
        map.animateToRegion(reg);
      }
      //map.fitToElements(true);
    }
  }, [city, map, mapReady]);

  if (!me || !city) {
    return <T>No city, no me</T>;
  }
  //useEffect(() => {
  //map?.fitToElements(true);
  //}, [view]);

  const territories = React.useMemo(
    () =>
      cityAreas.areas.map((area) => {
        const connectedArea = areas?.find((x) => x.code === area.code);

        return {
          ...area,
          userId: connectedArea?.userId,
          gangId: connectedArea?.gangId || connectedArea?.user?.gangId,
        };
      }),
    [areas]
  );

  const NativeMapsComponent = Platform.select({
    native: () => require("react-native-maps").default,
    web: () => null,
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

  const iconToMapIcon = (icon) => {
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

    const onPress = () => navigation.navigate(icon.to);

    const theIcon = icon.icon;

    const deltaLatitude = (city?.delta * 3) / 100; //width
    const deltaLongitude = (city?.delta * 3) / 100;

    const topLeftLatitude = latitude - deltaLatitude / 2;
    const topLeftLongitude = longitude - deltaLongitude / 2;
    const bottomRightLatitude = latitude + deltaLatitude / 2;
    const bottomRightLongitude = longitude + deltaLongitude / 2;

    const topRightLatitude = latitude + deltaLatitude / 2;
    const topRightLongitude = longitude - deltaLongitude / 2;
    const bottomLeftLatitude = latitude - deltaLatitude / 2;
    const bottomLeftLongitude = longitude + deltaLongitude / 2;

    const square = [
      { lat: topLeftLatitude, lng: topLeftLongitude },
      { lat: topRightLatitude, lng: topRightLongitude },
      {
        lat: bottomRightLatitude,
        lng: bottomRightLongitude,
      },
      { lat: bottomLeftLatitude, lng: bottomLeftLongitude },
    ];

    return {
      onPress,
      icon: theIcon,
      latitude,
      longitude,
      square,
    };
  };

  const rightObjects = React.useMemo(
    () => (dragAndDropMode ? objectsWithAnimated : objects),
    [dragAndDropMode, region.latitudeDelta]
  );
  const renderGame = React.useMemo(
    () =>
      rightObjects.map((object, index) => {
        const isSelected = selected === object.type;

        return (
          <GameObjects
            key={`game${object.type}`}
            propertiesSwiperRefContainer={propertiesSwiperRefContainer}
            MapsComponent={NativeMapsComponent}
            city={city}
            dragAndDropMode={dragAndDropMode}
            object={object}
            index={index}
            isSelected={isSelected}
            cityAreas={cityAreas}
            setSelected={setSelected}
            reloadCities={reloadCities}
            level={me?.level}
            device={device}
            myName={me?.name}
          />
        );
      }),
    [
      rightObjects,
      selected,
      city,
      dragAndDropMode,
      cityAreas.city,
      me?.name,
      me?.level,
      device,
    ]
  );

  const renderTerritories = React.useMemo(() => {
    return (
      <Territories
        opacity={view === "territories" ? 0.4 : 0.2}
        onPress={
          view === "territories"
            ? (index) => {
                setSelected("area");
                setSelectedAreaIndex(index);
                territoriesSwiperRefContainer?.current?.goTo(index + 1);
              }
            : () => null
        }
        territories={territories}
        MapsComponent={NativeMapsComponent}
      />
    );
  }, [view, territories]);

  const renderCrimes = icons
    .map(iconToMapIcon)
    .map(({ onPress, icon, latitude, longitude, square }, index) => {
      //random positions on the first territorium
      const view = (
        <TouchableOpacity onPress={onPress} style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 24 }}>{icon}</Text>
        </TouchableOpacity>
      );
      return Platform.OS === "web" ? (
        <OverlayView
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          // onClick={onPress}
          key={`icon${index}`}
          position={{ lat: latitude, lng: longitude }}
        >
          {view}
        </OverlayView>
      ) : (
        <NativeMapsComponent.Marker
          key={`icon${index}`}
          onPress={onPress}
          coordinate={{ latitude, longitude }}
        >
          {view}
        </NativeMapsComponent.Marker>
      );
    });

  const renderAllMapObjects = React.useMemo(() => {
    const shouldRenderTerritories =
      Platform.OS === "web"
        ? view === "territories"
        : view === "territories" || view === "game" || view === "crimes";
    return (
      <>
        {shouldRenderTerritories && renderTerritories}
        {/* NB: areas.length moet geladen zijn voor renderGame, anders rendert hij de teritoriums over de game heen */}
        {(view === "all" || view === "game") && areas.length > 0 && renderGame}

        {(view === "all" || view === "crimes") && renderCrimes}
      </>
    );
  }, [view, renderTerritories, renderGame, renderCrimes, areas.length]);

  const renderMapsComponentNative = () => {
    return (
      <NativeMapsComponent
        onMapReady={() => {
          console.log("map ready");
          setMapReady(true);
        }}
        // provider={PROVIDER_GOOGLE}
        customMapStyle={Platform.OS === "android" ? mapStyle : undefined}
        ref={(map) => setMap(map)}
        initialRegion={region}
        onRegionChange={(r) => {
          setRegion(r);

          if (dragAndDropMode) {
            objectsWithAnimated.forEach((object) => {
              Animated.timing(object.animated, {
                toValue:
                  (city?.delta * OBJECT_SIZE_FACTOR * object.size) /
                  r.latitudeDelta,
                duration: 100,
                useNativeDriver: false,
              }).start();
            });
          }
        }}
        style={StyleSheet.absoluteFill}
      >
        {renderAllMapObjects}
      </NativeMapsComponent>
    );
  };

  const renderOverlay = (
    <Overlay
      setZoom={setZoom}
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
      territoriesSwiperRefContainer={territoriesSwiperRefContainer}
      propertiesSwiperRefContainer={propertiesSwiperRefContainer}
      cityAreas={cityAreas}
      areas={areas}
      navigation={navigation}
      city={city}
      objects={objects}
      reloadMe={reloadMe}
      reloadCities={reloadCities}
    />
  );

  return Platform.OS === "web" ? (
    <View style={{ flex: 1 }}>
      <ReactMap setMap={setMap} zoom={zoom} setMapReady={setMapReady}>
        {renderAllMapObjects}
      </ReactMap>
      {renderOverlay}
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      {renderMapsComponentNative()}

      {renderOverlay}
    </View>
  );
};

export default Map;
