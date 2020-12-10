import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Icon from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CountDown from "react-native-countdown-component";
import { Col, Grid } from "react-native-easy-grid";
import Swiper from "react-native-web-swiper";
import { useDispatch } from "react-redux";
import Chat from "../components/Chat";
import Dead from "../components/Dead";
import Fly from "../components/Fly";
import Jail from "../components/Jail";
import User from "../components/User";
import { getRank, getStrength, getTextFunction, numberFormat } from "../Util";
import ActionsBar from "./ActionsBar";
import BottomTabs from "./BottomTabs";
import MapIcon from "./MapIcon";
import { animateToCity, getZoom } from "./MapUtil";
import Menus from "./Menus";
import Modal from "./Modal";
import Screen from "./Screen";
import StatsHeader from "./StatsHeader";

const window = Dimensions.get("window");

const Overlay = ({
  screenProps,
  navigation,
  map,
  view,
  setView,
  setZoom,
  device,
  me,
  selected,
  setSelected,
  objects,
  dragAndDropMode,
  setDragAndDropMode,
  territoriesSwiperRefContainer,
  propertiesSwiperRefContainer,
  cityAreas,
  areas,
  reloadCities,
  reloadMe,
  city,
  selectedAreaIndex,
  setSelectedAreaIndex,
}) => {
  const dispatch = useDispatch();
  const window = Dimensions.get("window");
  const isSmallDevice = window.width < 800;
  const { showActionSheetWithOptions } = useActionSheet();
  const getText = getTextFunction(me?.locale);
  const [loading, setLoading] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(0);

  const selectedArea =
    selectedAreaIndex !== undefined
      ? areas?.find((x) => x.code === cityAreas.areas[selectedAreaIndex]?.code)
      : null;
  // console.log("render overlay");

  const openActionSheet = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html

    const options = [
      getText("killSomeone"),
      getText("robSomeone"),
      getText("organizeStreetrace"),
      getText("organizeRobbery"),
    ];

    if (me?.gangId) {
      options.push(getText("organizeOC"));
    }

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
        if (buttonIndex === 0) {
          navigation.navigate("Kill");
        } else if (buttonIndex === 1) {
          navigation.navigate("Rob");
        } else if (buttonIndex === 2) {
          navigation.navigate("CreateStreetrace");
        } else if (buttonIndex === 3) {
          navigation.navigate("CreateRobbery");
        } else if (buttonIndex === 4 && me?.gangId) {
          navigation.navigate("CreateOc");
        }
        // Do something here depending on the button index selected
      }
    );
  };

  const territoriesSwiperChildren = useMemo(
    () => [
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          {me?.city}: {cityAreas.areas.length} {getText("territories")}
        </Text>
      </View>,
      ...cityAreas.areas.map((area, index) => {
        const connectedArea = areas?.find((x) => x.code === area.code);

        return (
          <View key={`page${index}`} style={{ height: 150, flex: 1 }}>
            <Grid>
              <Col>
                <Text style={{ color: "white" }}>{getText("area")}</Text>
              </Col>
              <Col size={2}>
                <Text style={{ color: "white" }}>{area.name}</Text>
              </Col>
            </Grid>
            <Grid>
              <Col>
                <Text style={{ color: "white" }}>{getText("owner")}</Text>
              </Col>
              <Col size={2}>
                {connectedArea?.user && (
                  <User
                    size={40}
                    user={connectedArea.user}
                    navigation={navigation}
                  />
                )}
              </Col>
            </Grid>

            <Grid>
              <Col>
                <Text style={{ color: "white" }}>{getText("damage")}</Text>
              </Col>
              <Col size={2}>
                <Text style={{ color: "white" }}>
                  {connectedArea?.damage}% {getText("damage")}
                </Text>
              </Col>
            </Grid>

            <Text style={{ color: "white" }}></Text>
          </View>
        );
      }),
    ],
    [areas]
  );

  const territoriesSwiperKey = useMemo(() => Math.random().toString(), [areas]);

  const onTerritoriesIndexChanged = (position) => {
    if (position === 0) {
      //should animate to whole city
      animateToCity({ map, dispatch, city });
      setSelected(null);
      setSelectedAreaIndex(null);
    } else {
      setSelected("area");
      setSelectedAreaIndex(position - 1);

      const area = cityAreas.areas[position - 1];
      // const region = cityAreas.areas[position].area[0]; //first point for now, later pick center
      if (Platform.OS === "web") {
        map.panTo({
          lat: area.centerLatitude,
          lng: area.centerLongitude,
        });
        const biggestDelta =
          area.latitudeDelta > area.longitudeDelta
            ? area.latitudeDelta
            : area.longitudeDelta;

        setZoom(getZoom(biggestDelta));
      } else {
        map.animateToRegion({
          latitude: area.centerLatitude,
          longitude: area.centerLongitude,
          latitudeDelta: area.latitudeDelta,
          longitudeDelta: area.longitudeDelta,
        });
      }
    }
    //improve this once i have centers.
  };

  const renderTerritoriesSwiper = (
    <View style={{ height: 150 }}>
      <Swiper
        controlsEnabled={false}
        key={territoriesSwiperKey}
        ref={territoriesSwiperRefContainer}
        style={{ flex: 1 }}
        from={selectedAreaIndex + 1}
        onIndexChanged={onTerritoriesIndexChanged}
      >
        {territoriesSwiperChildren}
      </Swiper>
    </View>
  );

  const propertiesSwiperFirstPage = (
    <View style={{ flex: 1 }}>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
        {me?.city}
      </Text>
    </View>
  );

  const swiper1Children = useMemo(
    () => [
      propertiesSwiperFirstPage,

      ...objects.map((object, index) => {
        const keyValue = (key, value) => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ color: "white" }}>{key}</Text>
              <Text style={{ color: "white" }}>{value}</Text>
            </View>
          );
        };
        if (object.type === "house") {
          return (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1 }}>
                {keyValue(getText("cash"), `€${numberFormat(me?.cash)}`)}
                {keyValue(getText("bank"), `€${numberFormat(me?.bank)}`)}
                {keyValue(getText("gamepoints"), numberFormat(me?.gamepoints))}
                {keyValue(getText("rank"), getRank(me?.rank, "both"))}
                {keyValue(
                  getText("strength"),
                  getStrength(me?.strength, "both")
                )}
              </View>

              <View style={{ flex: 1 }}>
                {keyValue(getText("health"), `${me?.health}%`)}
                {keyValue(getText("bullets"), numberFormat(me?.bullets))}
                {keyValue(getText("weed"), numberFormat(me?.wiet))}
                {keyValue(getText("junkies"), numberFormat(me?.junkies))}
                {keyValue(getText("prostitutes"), numberFormat(me?.hoeren))}
              </View>
            </View>
          );
        }

        if (object.type === "headquarter") {
          return me?.gangId ? (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1 }}>
                {keyValue(getText("gang"), `${me?.gang?.name}`)}
                {keyValue(getText("bank"), `€${numberFormat(me?.gang?.bank)}`)}
                {keyValue(getText("bullets"), numberFormat(me?.gang?.bullets))}
                {keyValue(getText("members"), `${me?.gang?.members}`)}
              </View>

              <View style={{ flex: 1 }}></View>
            </View>
          ) : null;
        }

        const owner = city?.[`${object.type}Owner`];
        const damage = city?.[`${object.type}Damage`];
        const profit = city?.[`${object.type}Profit`];

        const ownerProfile = owner ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { name: owner })}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>{owner}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ fontWeight: "bold", color: "white" }}>
            ({getText("none")})
          </Text>
        );

        return (
          <View key={`page${index}`} style={{ flex: 1 }}>
            {owner !== undefined && (
              <Grid>
                <Col>
                  <Text style={{ color: "white" }}>
                    {getText(object.type)} {getText("owner")}
                  </Text>
                </Col>
                <Col>{ownerProfile}</Col>
              </Grid>
            )}

            {profit !== undefined && (
              <Grid>
                <Col>
                  <Text style={{ color: "white" }}>
                    {getText(object.type)} {getText("profit")}
                  </Text>
                </Col>
                <Col>
                  <Text style={{ color: "white" }}>
                    €{numberFormat(profit)},-
                  </Text>
                </Col>
              </Grid>
            )}
            {damage !== undefined && (
              <Grid>
                <Col>
                  <Text style={{ color: "white" }}>
                    {getText(object.type)} {getText("damage")}
                  </Text>
                </Col>
                <Col>
                  <Text style={{ color: "white" }}>{damage}%</Text>
                </Col>
              </Grid>
            )}
          </View>
        );
      }),
    ],
    [me?.city, city]
  );
  const keyValue = useMemo(() => Math.random().toString(), [swiper1Children]);

  const selectedIndex = useMemo(
    () => objects.findIndex((x) => x.type === selected),
    [swiper1Children]
  );
  const renderPropertiesSwiper = (
    <View style={{ height: 100 }}>
      <Swiper
        controlsEnabled={false}
        key={keyValue}
        ref={propertiesSwiperRefContainer}
        style={{ flex: 1 }}
        from={selectedIndex !== -1 ? selectedIndex + 1 : 0}
        onIndexChanged={(position) => {
          if (position === 0) {
            //should animate to whole city
            animateToCity({ map, dispatch, city });
            setSelected(null);
          } else {
            const object = objects[position - 1];
            setSelected(object.type);
          }
          //improve this once i have centers.
        }}
      >
        {swiper1Children}
      </Swiper>
    </View>
  );

  const currentObject = objects.find((x) => x.type === selected);
  const title =
    view === "game" || view === "territories"
      ? selected === "area"
        ? selectedArea?.name
        : currentObject
        ? getText(currentObject?.title)
        : ""
      : "";

  const renderHeader = (
    <View
      style={{
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.5)",
        top: 0,
        left: 0,
        right: 0,
        padding: 5,
      }}
      onLayout={({
        nativeEvent: {
          layout: { width, height },
        },
      }) => {
        setHeaderHeight(height);
      }}
    >
      <SafeAreaView
        style={{
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        {view === "territories" ? (
          renderTerritoriesSwiper
        ) : view === "game" ? (
          renderPropertiesSwiper
        ) : view === "crimes" || view === "stats" ? (
          <StatsHeader navigation={navigation} device={device} me={me} />
        ) : null}
        {!isSmallDevice && (
          <Chat me={me} device={device} navigation={navigation} />
        )}
      </SafeAreaView>
    </View>
  );

  const allowedRoutes = [
    "Home",
    "Settings",
    "Members",
    "Profile",
    "Status",
    "Stats",
    "MyObjects",
    "Chat",
    "Channels",
    "Channel",
    "Forum",
    "Info",
    "InfoGame",
    "InfoRules",
    "Privacy",
    "Contribute",
    "Prizes",
    "Notifications",
    "VerifyPhone",
    "ChangePassword",
    "SignupEmail",
    "ChangeName",
    "Theme",
    "Login",
    "MyProfile",
    "Backfire",
    "Accomplice",
    "Gangs",
    "Gang",
    "GangSettings",
    "GangAchievements",
    "Market",
  ];
  const skip = allowedRoutes.includes(navigation.state.routeName);

  return (
    <>
      <Menus
        areas={screenProps.areas}
        channels={screenProps.channels}
        city={city}
        cityAreas={cityAreas}
        setSelectedAreaIndex={setSelectedAreaIndex}
        map={map}
        setSelected={setSelected}
        setZoom={setZoom}
        setView={setView}
        dispatch={dispatch}
        device={device}
        me={me}
        navigation={navigation}
      >
        {renderHeader}

        <View style={{ position: "absolute", left: 10, bottom: 135 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>{title}</Text>
        </View>

        {view === "crimes" && (
          <View
            style={{
              position: "absolute",
              top: headerHeight + 10,
              left: 5,
            }}
          >
            <MapIcon
              view={{
                icon: Icon.AntDesign,
                iconName: "plus",
                isActive: false,
                onPress: openActionSheet,
              }}
            />
          </View>
        )}

        {!isSmallDevice && (
          <View
            style={{
              position: "absolute",
              top: headerHeight + 10,
              right: 5,
            }}
          >
            <MapIcon
              view={{
                icon: Icon.Entypo,
                iconName: "menu",
                isActive: false,
                onPress: () =>
                  dispatch({
                    type: "SET_MENU_SHOWN",
                    value: !device.menuShown,
                  }),
              }}
            />
          </View>
        )}

        {loading && (
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <ActivityIndicator color="black" size="large" />
          </View>
        )}

        <View
          style={{
            position: "absolute",
            top: headerHeight + 60,

            right: 5,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 20,
          }}
        >
          {me?.reizenAt > Date.now() && (
            <View style={{ flexDirection: "row", padding: 10 }}>
              <Icon.Ionicons name="ios-airplane" color="white" size={24} />

              <CountDown
                until={Math.round((me?.reizenAt - Date.now()) / 1000)}
                onFinish={() => {
                  // reloadMe(device.loginToken);
                }}
                size={10}
                timeToShow={["M", "S"]}
                timeLabels={{ m: null, s: null }}
              />
            </View>
          )}

          {me?.jailAt > Date.now() && (
            <View style={{ flexDirection: "row", padding: 10 }}>
              <Icon.FontAwesome name="bars" color="white" size={24} />

              <CountDown
                until={Math.round((me?.jailAt - Date.now()) / 1000)}
                onFinish={() => {
                  // reloadMe(device.loginToken);
                }}
                size={10}
                timeToShow={["M", "S"]}
                timeLabels={{ m: null, s: null }}
              />
            </View>
          )}

          {me?.bunkerAt > Date.now() && (
            <View style={{ flexDirection: "row", padding: 10 }}>
              <Icon.FontAwesome name="shield" color="white" size={24} />

              <CountDown
                until={Math.round((me?.bunkerAt - Date.now()) / 1000)}
                onFinish={() => {
                  // reloadMe(device.loginToken);
                }}
                size={10}
                timeToShow={["M", "S"]}
                timeLabels={{ m: null, s: null }}
              />
            </View>
          )}
        </View>

        <ActionsBar
          selected={selected}
          view={view}
          city={city}
          me={me}
          device={device}
          navigation={navigation}
          setLoading={setLoading}
          reloadMe={reloadMe}
          reloadCities={reloadCities}
          reloadAreas={screenProps.reloadAreas}
          selectedArea={selectedArea}
        />

        {navigation.state.routeName ? (
          <Modal
            headerHeight={headerHeight}
            view={view}
            navigation={navigation}
            setView={setView}
          >
            {me?.reizenAt > Date.now() && !skip ? (
              <Fly screenProps={screenProps} navigation={navigation} />
            ) : (me?.health <= 0 || me?.health === null) && !skip ? (
              <Dead screenProps={screenProps} navigation={navigation} />
            ) : me?.jailAt > Date.now() && !skip ? (
              <Jail screenProps={screenProps} navigation={navigation} />
            ) : (
              <Screen navigation={navigation} screenProps={screenProps} />
            )}
          </Modal>
        ) : null}

        <BottomTabs
          getText={getText}
          view={view}
          setSelected={setSelected}
          navigation={navigation}
          setView={setView}
          map={map}
          setZoom={setZoom}
          city={city}
          dragAndDropMode={dragAndDropMode}
          setDragAndDropMode={setDragAndDropMode}
          level={me?.level}
          chatBadgeCount={me?.chats}
          territoriesBadgeCount={0}
          crimesBadgeCount={0}
          gameBadgeCount={0}
        />

        {/* 
        
        <View
          style={{
            position: "absolute",
            zIndex: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <Image
            source={require("../../../assets/gangster2.png")}
            style={{ width: 300, height: 250 }}
            resizeMode="contain"
          />

          <Text
            style={{ position: "absolute", top: 40, right: 35, width: 140 }}
          >
            He jij daar! Wat ben je aan het doen? Ga eens even snel een misdaad
            doen! Klik onderin het menu op het tweede icoontje om naar het
            misdaden overzicht te gaan.
          </Text>
        </View> */}
      </Menus>
    </>
  );
};

export default Overlay;
