import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Icon from "@expo/vector-icons";
import ViewPager from "@react-native-community/viewpager";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import T from "../components/T";
import User from "../components/User";
import {
  doOnce,
  get,
  getRank,
  getTextFunction,
  numberFormat,
  post,
} from "../Util";
const citiesAreas = require("../../assets/map/cities.json");

/*



*/

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90",
      },
    ],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a5b076",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6",
      },
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b9d3c2",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];
const API_KEY = "AIzaSyCOENphOkWqcrvmehHhhgKu7lJpwqfLQzc";
const objects = [
  {
    type: "bulletFactory",
    to: "AllBulletfactory",
    image: require("../../assets/map/bulletfactory.png"),
    size: 10,
  },
  {
    type: "airport",
    to: "AllAirport",
    image: require("../../assets/map/airport.png"),
    size: 15,
  },

  {
    type: "bank",
    to: "AllBanks",
    image: require("../../assets/map/bank.png"),
    size: 8,
  },

  {
    type: "casino",
    to: "Casino",
    image: require("../../assets/map/casino.png"),
    size: 20,
  },

  {
    type: "landlord",
    to: "Wiet",
    image: require("../../assets/map/farm.png"),
    size: 10,
  },

  {
    type: "garage",
    to: "AllGarage",
    image: require("../../assets/map/garage.png"),
    size: 10,
  },

  {
    type: "gym",
    to: "Gym",
    image: require("../../assets/map/gym.png"),
    size: 10,
  },

  {
    type: "hospital",
    to: "Hospital",
    image: require("../../assets/map/hospital.png"),
    size: 10,
  },

  {
    type: "house",
    to: "House",
    image: require("../../assets/map/house2.png"),
    size: 10,
  },

  {
    type: "headquarter",
    to: "AllGang",
    image: require("../../assets/map/headquarter.png"),
    size: 10,
  },

  {
    type: "jail",
    to: "Jail",
    image: require("../../assets/map/jail.png"),
    size: 10,
  },

  {
    type: "market",
    to: "Market",
    image: require("../../assets/map/market.png"),
    size: 10,
  },
  {
    type: "weaponShop",
    to: "Shop",
    image: require("../../assets/map/shop.png"),
    size: 10,
  },

  {
    type: "estateAgent",
    to: "EstateAgent",
    image: require("../../assets/map/shop.png"),
    size: 10,
  },

  {
    type: "rld",
    to: "Hoeren",
    image: require("../../assets/map/shop.png"),
    size: 10,
  },

  {
    type: "stockExchange",
    to: "StockExchange",
    image: require("../../assets/map/market.png"),
    size: 10,
  },
];

const OBJECT_SIZE_FACTOR = 10;

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
const MapIcon = React.memo(({ view }) => {
  return (
    <TouchableOpacity
      key={`v${view.view}`}
      hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      style={{
        marginBottom: 10,
        backgroundColor: view.isActive ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.4)",
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={view.onPress}
    >
      <view.icon name={view.iconName} color="white" size={30} />
    </TouchableOpacity>
  );
});
const Territories = React.memo(
  ({ getTerritories, MapsComponent, onPress, opacity }) => {
    return getTerritories().map(({ area, userId, gangId }, index) => {
      const number = gangId ? gangId : userId ? userId : 0;
      const rgb = !number ? "255,255,255" : rgbs[number % (rgbs.length - 1)];

      return (
        <MapsComponent.Polygon
          key={`polygon${index}`}
          onPress={onPress}
          tappable
          coordinates={area}
          fillColor={`rgba(${rgb},${opacity})`}
        />
      );
    });
  }
);

const Stats = React.memo(({ me, device }) => {
  const textStyle = {
    marginRight: 10,
    marginBottom: 10,
    color: "black",
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={textStyle}>
        {me?.name} {me?.gang?.name}
      </Text>
      <Text style={textStyle}>❤️ {me?.health}%</Text>

      <Text style={textStyle}>💰 €{numberFormat(me?.cash)},-</Text>
      <Text style={textStyle}>💵 €{numberFormat(me?.bank)},-</Text>
      <View style={{ flexDirection: "row" }}>
        <Icon.MaterialCommunityIcons
          name="pistol"
          size={18}
          color={device.theme.secondaryText}
          style={{ marginRight: 5 }}
        />
        <Text style={textStyle}>{numberFormat(me?.bullets)}</Text>
      </View>
      <Text style={textStyle}>🔥 {me?.gamepoints}</Text>
      <Text style={textStyle}>
        ⭐️ {getRank(me?.rank, "both")} ({me?.position}e)
      </Text>
    </View>
  );
});

const Map = ({
  navigation,
  screenProps: { device, cities, reloadCities, me },
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

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

  const getAreas = async () => {
    const { areas } = await get(`areas?city=${me?.city}`);
    setAreas(areas);
  };
  useEffect(() => {
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
      //map.animateToRegion(reg);
      map.fitToElements(true);
    }
  }, [city, map]);

  useEffect(() => {
    map?.fitToElements(true);
  }, [view]);

  const getText = getTextFunction(me?.locale);

  const objectsWithAnimated = objects.map((object) => ({
    ...object,
    animated: useRef(
      new Animated.Value(
        (city?.delta * OBJECT_SIZE_FACTOR * object.size) / region.latitudeDelta
      )
    ).current,
  }));

  const icons = [
    {
      inactive: me?.autostelenAt + 60000 - Date.now() > 0,
      to: "StealCar",
      icon: "🚘",
    },

    {
      inactive: me?.crimeAt + 60000 - Date.now() > 0,
      to: "Crimes",
      icon: "💰",
    },

    {
      inactive: me?.junkiesAt + 120000 - Date.now() > 0,
      to: "Junkies",
      icon: "🧔",
    },

    {
      inactive: me?.hoerenAt + 120000 - Date.now() > 0,
      to: "Hoeren",
      icon: "💃",
    },
  ].filter((x) => !x.inactive);

  if (!city || !cityAreas) {
    return (
      <View>
        <T>
          {me?.city} {getText("loading")}
        </T>
        <Button
          title="Vliegveld"
          onPress={() => navigation.navigate("Airport")}
        />
      </View>
    );
  }

  const openActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html

    const options = ["Organize an OC", "Organize Streetrace", "Do Robbery"];

    options.push(getText("cancel"));
    const destructiveButtonIndex = undefined;
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        // Do something here depending on the button index selected
      }
    );
  };

  const MapsComponent = Platform.select({
    native: () => require("react-native-maps").default,
    web: () => require("google-map-react").default,
  })();

  const viewPagerRefContainer = useRef(null);

  const getTerritories = () =>
    cityAreas.areas.map((area) => {
      const connectedArea = areas?.find((x) => x.code === area.code);

      return {
        ...area,
        userId: connectedArea?.userId,
        gangId: connectedArea?.gangId || connectedArea?.user?.gangId,
      };
    });

  const animateToCity = () =>
    map.animateToRegion({
      latitude: city.latitude,
      longitude: city.longitude,
      latitudeDelta: city.delta * 1.2,
      longitudeDelta: city.delta * 1.2,
    });
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
        {(view === "all" || view === "game") &&
          objectsWithAnimated.map((object, index) => {
            let latitude = city[`${object.type}Latitude`];
            let longitude = city[`${object.type}Longitude`];

            if (!latitude || !longitude) {
              const terri =
                cityAreas.areas[index % (cityAreas.areas.length - 1)];
              latitude = terri.centerLatitude;
              longitude = terri.centerLongitude;
            }

            return (
              <MapsComponent.Marker
                draggable={me?.level >= 5}
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
                onPress={() => navigation.navigate(object.to)}
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
            );
          })}

        {(view === "all" ||
          view === "territories" ||
          view === "game" ||
          view === "crimes") && (
          <Territories
            opacity={view === "territories" ? 0.4 : 0.2}
            onPress={
              view === "territories"
                ? () => {
                    viewPagerRefContainer?.current?.setPage(index + 1);
                  }
                : () => null
            }
            getTerritories={getTerritories}
            MapsComponent={MapsComponent}
          />
        )}
        {(view === "all" || view === "crimes") &&
          icons.map((icon, index) => {
            const territorium = cityAreas.areas[0];

            const rand = (x, y) => x + Math.random() * (y - x);

            const latitude = rand(
              territorium.centerLatitude - territorium.latitudeDelta / 2,
              territorium.centerLatitude + territorium.latitudeDelta / 2
            );
            const longitude = rand(
              territorium.centerLongitude - territorium.longitudeDelta / 2,
              territorium.centerLongitude + territorium.longitudeDelta / 2
            );
            //random positions on the first territorium
            return (
              <MapsComponent.Marker
                draggable
                onDragEnd={({ nativeEvent: { coordinate } }) =>
                  console.log(coordinate)
                }
                key={`icon${index}`}
                onPress={() => navigation.navigate(icon.to)}
                coordinate={{ latitude, longitude }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 24 }}>{icon.icon}</Text>
                  {/* <Text>{icon.to}</Text> */}
                </View>
              </MapsComponent.Marker>
            );
          })}
      </MapsComponent>

      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.2)",
          top: 0,
          left: 0,
          right: 0,
          padding: 5,
        }}
      >
        <SafeAreaView>
          {view === "territories" ? (
            <ViewPager
              ref={viewPagerRefContainer}
              style={{ flex: 1, height: 200 }}
              initialPage={0}
              onPageSelected={({ nativeEvent: { position } }) => {
                if (position === 0) {
                  //should animate to whole city
                  animateToCity();
                } else {
                  const area = cityAreas.areas[position - 1];
                  // const region = cityAreas.areas[position].area[0]; //first point for now, later pick center
                  map.animateToRegion({
                    latitude: area.centerLatitude,
                    longitude: area.centerLongitude,
                    latitudeDelta: area.latitudeDelta,
                    longitudeDelta: area.longitudeDelta,
                  });
                }
                //improve this once i have centers.
              }}
            >
              <View>
                <Text>
                  {me?.city}:{cityAreas.areas.length} territoriums
                </Text>
              </View>
              {cityAreas.areas.map((area, index) => {
                const connectedArea = areas?.find((x) => x.code === area.code);

                return (
                  <View key={`page${index}`} style={{ height: 200 }}>
                    <Text>{area.name}</Text>
                    {connectedArea?.user && (
                      <User user={connectedArea.user} navigation={navigation} />
                    )}

                    {connectedArea && !connectedArea?.userId && (
                      <Button
                        title={getText("takeOver")}
                        onPress={async () => {
                          await post(`takeEmptyArea`, {
                            id: connectedArea?.id,
                            loginToken: device.loginToken,
                          });

                          getAreas();
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </ViewPager>
          ) : (
            <Stats device={device} me={me} />
          )}
        </SafeAreaView>
      </View>

      <View style={{ position: "absolute", right: 3, bottom: 3 }}>
        {[
          {
            view: "game",
            icon: Icon.MaterialCommunityIcons,
            iconName: "factory",
            isActive: view === "game",
            onPress: () => {
              setView("game");
            },
          },
          {
            view: "crimes",
            icon: Icon.MaterialCommunityIcons,
            iconName: "pistol",
            isActive: view === "crimes",
            onPress: () => {
              setView("crimes");
            },
          },
          {
            view: "territories",
            icon: Icon.Ionicons,
            iconName: "md-grid",
            isActive: view === "territories",
            onPress: () => {
              setView("territories");
              animateToCity();
            },
          },
          {
            view: "all",
            icon: Icon.AntDesign,
            iconName: "star",
            isActive: view === "all",
            onPress: () => {
              setView("all");
            },
          },
        ].map((v) => (
          <MapIcon view={v} />
        ))}
      </View>

      <View style={{ position: "absolute", left: 3, bottom: 3 }}>
        {[
          {
            icon: Icon.Entypo,
            iconName: "plus",
            isActive: false,
            onPress: openActionSheet,
          },
        ].map((v) => {
          return <MapIcon view={v} />;
        })}
      </View>
    </View>
  );
};

export default Map;
