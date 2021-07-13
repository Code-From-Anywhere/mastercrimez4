import {
  Circle,
  GoogleMap,
  GroundOverlay,
  LoadScript,
  OverlayView,
  Polygon,
} from "@react-google-maps/api";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { AlertContext } from "../components/AlertProvider";
import { doOnce, getTextFunction, post } from "../Util";
import Logic from "./Logic";
import {
  animateToCity,
  API_KEY,
  getObjectMeta,
  getPosition,
  getZoom,
  objects,
  OBJECT_SIZE_FACTOR,
  rgbs,
  selectBuilding,
  shouldRenderCities,
} from "./MapUtil";
import Overlay from "./Overlay";
const mapStyle = require("./mapStyle.json");
const mapStyleNight = require("./mapStyleNight.json");

const citiesAreas = require("../../assets/map/cities.json");

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const ReactMap = React.memo(
  ({ zoom, map, setMap, children, view, setMapReady }) => {
    const dispatch = useDispatch();
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
          clickableIcons={false}
          mapContainerStyle={containerStyle}
          zoom={zoom}
          onZoomChanged={() => {
            const zoom = map?.getZoom();
            // console.log("zoom changed to ", zoom);
            dispatch({ type: "SET_ZOOM", value: zoom });
          }}
          //center={{ lat: city?.latitude, lng: city?.longitude }}
          onLoad={onLoad}
          options={{
            disableDefaultUI: true,

            //https://developers.google.com/maps/documentation/javascript/style-reference
            styles:
              view === "territories"
                ? [
                    {
                      featureType: "all",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                    {
                      featureType: "road",
                      elementType: "geometry.fill",
                      stylers: [{ visibility: "off" }],
                    },
                  ]
                : undefined,
          }}
          onUnmount={onUnmount}
        >
          {children}
        </GoogleMap>
      </LoadScript>
    );
  }
);

const Territories = React.memo(
  ({ territories, MapsComponent, onPress, opacity, selectedAreaIndex }) => {
    return territories.map(({ area, userId, gangId }, index) => {
      const number = gangId ? gangId : userId ? userId : 0;
      const rgb = !number ? "255,255,255" : rgbs[number % (rgbs.length - 1)];
      const key = `polygon${index}`;
      const onClick = () => onPress(index);
      const realOpacity = index === selectedAreaIndex ? 0.4 : opacity;

      const fillColor = `rgba(${rgb},${realOpacity})`;
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
    gangMembers,
    setView,
    myName,
    device,
    junkiesIncomeAt,
    landlordIncomeAt,
    rldIncomeAt,
    getText,
    gymAt,
    gymTime,
    peopleInJail,
  }) => {
    // console.log("RENDER GAME OBJECT", index);
    const dispatch = useDispatch();
    const alertAlert = React.useContext(AlertContext);

    const { latitude, longitude, radius, square, bounds, platformBounds } =
      getObjectMeta({ object, index, city, cityAreas });

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
        alertAlert(response, null, null, { key: "moveBuildingResponse" });
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
      isSelected
        ? setSelected(null)
        : selectBuilding({
            type: object.type,
            animate: false,
            setSelected,
            setView,
            device,
            dispatch,
            getText,
          });
    };
    const owner = city?.[`${object.type}Owner`];

    const isYours = owner === myName;
    const isGang = gangMembers?.map((x) => x.name).includes(owner);
    const hasDamage = city?.[`${object.type}Damage`] > 0;
    const hasProfit = city?.[`${object.type}Profit`] > 0;

    const incomeJunkies =
      object.type === "junkies" &&
      Math.floor((Date.now() - junkiesIncomeAt) / 3600000) > 0;
    const incomeLandlord =
      object.type === "landlord" &&
      Math.floor((Date.now() - landlordIncomeAt) / 3600000) > 0;
    const incomeRLD =
      object.type === "rld" &&
      Math.floor((Date.now() - rldIncomeAt) / 3600000) > 0;

    const incomeToGet = incomeJunkies || incomeRLD || incomeLandlord;
    const jailPrisoners = object.type === "jail" && peopleInJail > 0;
    const gymTrain = object.type === "gym" && gymAt + gymTime - Date.now() < 0;
    const canDoSomething = jailPrisoners || gymTrain;
    const specialColor = isSelected
      ? "rgba(0,0,0,0.5)"
      : isYours && hasDamage
      ? "rgba(139,0,0,0.5)"
      : (isYours && hasProfit) || incomeToGet || canDoSomething
      ? "rgba(255,255,0,0.5)"
      : isYours
      ? "rgba(0,0,255,0.5)"
      : !owner && object.type !== "house" && object.type !== "headquarter"
      ? "rgba(172,216,230,0.5)" //lightblue
      : hasDamage
      ? "rgba(255,0,0,0.5)"
      : isGang
      ? "rgba(0,255,0,0.5)"
      : null;

    return Platform.OS === "web" ? (
      <>
        {specialColor ? (
          <Circle
            key={`circle${index}${isSelected}`}
            center={{ lat: latitude, lng: longitude }}
            radius={radius}
            options={{ fillColor: specialColor, strokeColor: specialColor }}
            onClick={onPressObject}
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
        {specialColor ? (
          <MapsComponent.Circle
            key={`circle${index}${isSelected}`}
            center={{ latitude, longitude }}
            radius={radius}
            fillColor={specialColor}
            strokeColor={specialColor}
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

const DEFAULT_CITY = "Amsterdam";
const Map = React.memo(function MapPure({
  navigation,
  screenProps,
  screenProps: {
    device,
    cities,
    areas,
    me,
    ocs,
    dispatch,
    reloadMe,
    streetraces,
    robberies,
    reloadCities,
    reloadStreetraces,
    reloadOcs,
    reloadRobberies,
    reloadAreas,
  },
}) {
  doOnce(() => {
    dispatch({ type: "SET_ZOOM", value: getZoom(city?.delta) });
  });

  const [dragAndDropMode, setDragAndDropMode] = useState(false);

  const [selected, setSelected] = useState(null);
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(null); //index

  const getText = getTextFunction(me?.locale);
  const [map, setMap] = useState(null);
  const [view, setView] = useState("crimes");

  const delta = me?.canChooseCity ? 5 : 0.05;

  const city = React.useMemo(
    () => cities?.find((x) => x.city === (me?.city ? me?.city : DEFAULT_CITY)),
    [cities, me?.city]
  );

  const [region, setRegion] = useState({
    latitude: city?.latitude || 52.378, //amsterdam
    longitude: city?.longitude || 4.89707,
    latitudeDelta: city?.delta || delta,
    longitudeDelta: city?.delta || delta,
  });

  const [mapReady, setMapReady] = useState(false);

  const territoriesSwiperRefContainer = useRef(null);
  const propertiesSwiperRefContainer = useRef(null);

  doOnce(reloadCities);

  const alertAlert = React.useContext(AlertContext);

  doOnce(() => reloadOcs(device.loginToken));
  doOnce(reloadStreetraces);
  doOnce(reloadRobberies);
  useEffect(() => {
    reloadAreas(me?.city);
  }, [me?.city]);

  const cityAreas = citiesAreas.find(
    (x) => x.city === (me?.city || DEFAULT_CITY)
  );

  const objectsWithAnimated = objects.map((object) => ({
    ...object,
    animated: useRef(
      new Animated.Value(
        (city?.delta * OBJECT_SIZE_FACTOR * object.size) / region.latitudeDelta
      )
    ).current,
  }));

  useEffect(() => {
    if (selected === "area") {
      territoriesSwiperRefContainer?.current?.goTo(selectedAreaIndex + 1);
    } else if (selected) {
      const index = objects.findIndex((o) => o.type === selected);
      propertiesSwiperRefContainer?.current?.goTo(index + 1);
    }
  }, [selected, selectedAreaIndex]);

  useEffect(() => {
    if (city) {
      const reg = {
        latitude: city?.latitude, //amsterdam
        longitude: city?.longitude,
        latitudeDelta: city?.delta,
        longitudeDelta: city?.delta,
      };
      setRegion(reg);
    }
    if (map && mapReady) {
      animateToCity({
        map,
        dispatch,
        city,
        delayZoom: true,
        zoom: !me || !me?.id || me?.canChooseCity ? 3 : undefined,
      });

      //map.fitToElements(true);
    }
  }, [me?.city, map, mapReady]);

  const territories = React.useMemo(
    () =>
      cityAreas?.areas.map((area) => {
        const connectedArea = areas?.find((x) => x?.code === area?.code);

        return {
          ...area,
          userId: connectedArea?.userId,
          gangId: connectedArea?.gangId || connectedArea?.user?.gangId,
        };
      }),
    [areas, cityAreas]
  );

  //useEffect(() => {
  //map?.fitToElements(true);
  //}, [view]);

  const NativeMapsComponent = Platform.select({
    native: () => require("react-native-maps").default,
    web: () => null,
  })();

  const crimeIcons = [
    {
      id: 1,
      inactive: me?.autostelenAt + 60000 - Date.now() > 0,
      to: "StealCar",
      icon: "🚘",
      type: "stealcar",
    },

    {
      id: 2,
      inactive: me?.crimeAt + 60000 - Date.now() > 0,
      to: "Crimes",
      icon: "💰",
      type: "crimes",
    },

    {
      id: 3,
      inactive: me?.junkiesAt + 120000 - Date.now() > 0,
      to: "Junkies",
      icon: "🧔",
      type: "junkies",
    },

    {
      id: 4,
      inactive: me?.hoerenAt + 120000 - Date.now() > 0,
      to: "Hoeren",
      icon: "💃",
      type: "hoeren",
    },
    {
      id: 5,
      inactive: me?.workEndsAt - Date.now() > 0,
      to: "Work",
      icon: "🛠",
      type: "work",
    },

    {
      id: 6,
      inactive: me?.wietAt + 120000 - Date.now() > 0,
      to: "Wiet",
      icon: "🌳",
      type: "wiet",
    },

    {
      id: 7,
      inactive: !me?.gangId || ocs?.length === 0,
      icon: "🔥",
      type: "oc",
      to: "OC",
    },

    {
      id: 8,
      inactive: streetraces?.length === 0,
      icon: "🛣",
      type: "streetrace",
      to: "Streetrace",
    },

    {
      id: 9,
      inactive: robberies?.length === 0,
      icon: "🚨",
      type: "robbery",
      to: "Robbery",
    },
  ].filter((x) => !x.inactive);

  const icons = crimeIcons.filter((x) => !!x);

  const iconToMapIcon = (icon) => {
    const position = getPosition(icon.id, icon.type); //0-1

    const areaIndex = Math.floor(cityAreas?.areas.length * position);

    const area = cityAreas?.areas[areaIndex];

    if (!area) return {};
    const pseudoRandom = (x, y) => x + position * (y - x);

    const latitude = pseudoRandom(
      area.centerLatitude - area.latitudeDelta / 2,
      area.centerLatitude + area.latitudeDelta / 2
    );
    const longitude = pseudoRandom(
      area.centerLongitude - area.longitudeDelta / 2,
      area.centerLongitude + area.longitudeDelta / 2
    );

    const onPress = () => navigation.resetTo(icon.to);

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
            getText={getText}
            gangMembers={me?.gangMembers}
            key={`game${object.type}`}
            MapsComponent={NativeMapsComponent}
            city={city}
            setView={setView}
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
            junkiesIncomeAt={me?.junkiesIncomeAt}
            landlordIncomeAt={me?.landlordIncomeAt}
            rldIncomeAt={me?.rldIncomeAt}
            gymAt={me?.gymAt}
            gymTime={me?.gymTime}
            peopleInJail={me?.jail}
          />
        );
      }),
    [
      rightObjects,
      selected,
      city,
      dragAndDropMode,
      cityAreas?.city,
      me?.name,
      me?.level,
      device,
    ]
  );

  const renderTerritories = React.useMemo(() => {
    return (
      <Territories
        opacity={view === "territories" ? 0.8 : 0.2}
        onPress={
          view === "territories"
            ? (index) => {
                setSelected("area");
                setSelectedAreaIndex(index);
              }
            : () => null
        }
        selectedAreaIndex={selectedAreaIndex}
        territories={territories}
        MapsComponent={NativeMapsComponent}
      />
    );
  }, [view, territories, selectedAreaIndex]);

  const renderCities = cities?.map((city, index) => {
    const onPress = async () => {
      const airplanes = [
        "Geen vliegtuig",
        "Fokker",
        "Fleet",
        "Havilland",
        "Cessna",
        "Douglas",
        "Lear Jet",
        "Raket",
      ];
      const airplane = airplanes[me?.airplane];
      const times = [0, 180, 120, 90, 60, 30, 20, 10];
      const time = times[me?.airplane];
      const costs = [0, 5000, 10000, 15000, 25000, 50000, 100000, 200000];
      const cost = costs[me?.airplane];

      alertAlert(
        city.city,
        me?.canChooseCity
          ? getText("chooseCityText", city.city)
          : me?.airplane === 0
          ? getText("noAirplane")
          : getText("travelToCityXYZ", airplane, city.city, time, cost),
        [
          (me?.airplane > 0 || me?.canChooseCity) && {
            text: getText("ok"),
            onPress: async () => {
              const { response } = await post("airport", {
                token: device.loginToken,
                to: city.city,
              });

              reloadMe(device.loginToken);
              alertAlert(response, null, null, { key: "airportResponse" });
              animateToCity({ city, dispatch, map, animationTime: 10000 });
              if (device.introLevel === 2) {
                dispatch({ type: "UP_INTRO_LEVEL" });
              }
            },
          },
          {
            text: getText("cancel"),
          },
        ].filter((x) => !!x),
        { key: "airport" }
      );
    };
    //random positions on the first territorium
    const view = (
      <TouchableOpacity
        style={
          Platform.OS === "web"
            ? { position: "absolute", top: -10, left: -10 }
            : undefined
        }
        onPress={onPress}
      >
        <Text style={{ fontSize: 24 }}>✈️</Text>
      </TouchableOpacity>
    );
    return Platform.OS === "web" ? (
      <OverlayView
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        // onClick={onPress}
        key={`city${index}`}
        position={{ lat: city.latitude, lng: city.longitude }}
      >
        {view}
      </OverlayView>
    ) : (
      <NativeMapsComponent.Marker
        key={`city${index}`}
        onPress={onPress}
        coordinate={{ latitude: city.latitude, longitude: city.longitude }}
      >
        {view}
      </NativeMapsComponent.Marker>
    );
  });
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
      Platform.OS === "web" ? view === "territories" : true;

    const shouldRenderGame =
      view === "stats" || view === "more" || view === "game" || view === "chat";

    return shouldRenderCities(device, region) ? (
      renderCities
    ) : (
      <>
        {shouldRenderTerritories && renderTerritories}
        {/* NB: areas.length moet geladen zijn voor renderGame, anders rendert hij de teritoriums over de game heen */}
        {shouldRenderGame && areas.length > 0 && renderGame}
        {view === "crimes" && renderCrimes}
      </>
    );
  }, [view, renderTerritories, renderGame, renderCrimes, areas.length]);

  const renderMapsComponentNative = () => {
    return (
      <NativeMapsComponent
        pitchEnabled={false}
        rotateEnabled={false}
        onMapReady={() => {
          console.log("map ready");
          setMapReady(true);
        }}
        // provider={PROVIDER_GOOGLE}
        customMapStyle={
          Platform.OS === "android"
            ? moment().hour() > 18 && moment().hour() < 7
              ? mapStyleNight
              : mapStyle
            : undefined
        }
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

  const setZoom = (zoom) => dispatch({ type: "SET_ZOOM", value: zoom });

  const renderOverlay = (
    <Overlay
      region={region}
      screenProps={screenProps}
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
      setZoom={setZoom}
    />
  );

  return Platform.OS === "web" ? (
    <Logic screenProps={screenProps} navigation={navigation}>
      <View style={{ flex: 1 }}>
        <ReactMap
          map={map}
          setMap={setMap}
          zoom={device.map.zoom}
          setMapReady={setMapReady}
          view={view}
        >
          {renderAllMapObjects}
        </ReactMap>
        {renderOverlay}
      </View>
    </Logic>
  ) : (
    <Logic screenProps={screenProps} navigation={navigation}>
      <View style={{ flex: 1 }}>
        {renderMapsComponentNative()}
        {renderOverlay}
      </View>
    </Logic>
  );
});

// Map.whyDidYouRender = { logOnDifferentValues: true };

export default Map;
