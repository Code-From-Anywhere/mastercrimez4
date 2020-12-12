import React from "react";
import AdminEmail from "../screens/AdminEmail";
import AdminUserWatch from "../screens/AdminUserWatch";
import AirplaneShop from "../screens/AirplaneShop";
import Airport from "../screens/Airport";
import AllAirport from "../screens/AllAirport";
import AllBanks from "../screens/AllBanks";
import AllBulletfactory from "../screens/AllBulletfactory";
import AllGang from "../screens/AllGang";
import AllGarage from "../screens/AllGarage";
import AllStats from "../screens/AllStats";
import Backfire from "../screens/Backfire";
import Bank from "../screens/Bank";
import Blocks from "../screens/Blocks";
import Bomb from "../screens/Bomb";
import Bulletfactory from "../screens/Bulletfactory";
import Bunker from "../screens/Bunker";
import Casino from "../screens/Casino";
import ChangeName from "../screens/ChangeName";
import ChangePassword from "../screens/ChangePassword";
import Channel from "../screens/Channel";
import Channels from "../screens/Channels";
import Chat from "../screens/Chat";
import ChooseProfession from "../screens/ChooseProfession";
import Code from "../screens/Code";
import Contribute from "../screens/Contribute";
import CreateOc from "../screens/CreateOC";
import CreateRobbery from "../screens/CreateRobbery";
import CreateStreetrace from "../screens/CreateStreetrace";
import Crimes from "../screens/Crimes";
import Detectives from "../screens/Detectives";
import Donate from "../screens/Donate";
import DownloadApp from "../screens/DownloadApp";
import EstateAgent from "../screens/EstateAgent";
import ForgotPassword from "../screens/ForgotPassword";
import Forum from "../screens/Forum";
import Gang from "../screens/Gang";
import GangAchievements from "../screens/GangAchievements";
import GangBulletFactory from "../screens/GangBulletFactory";
import GangCreate from "../screens/GangCreate";
import GangMissions from "../screens/GangMissions";
import Gangs from "../screens/Gangs";
import GangSettings from "../screens/GangSettings";
import GangShop from "../screens/GangShop";
import Garage from "../screens/Garage";
import GarageShop from "../screens/GarageShop";
import Gym from "../screens/Gym";
import Hackers from "../screens/Hackers";
import Hoeren from "../screens/Hoeren";
import Hospital from "../screens/Hospital";
import House from "../screens/House";
import Income from "../screens/Income";
import Info from "../screens/Info";
import InfoGame from "../screens/InfoGame";
import InfoRules from "../screens/InfoRules";
import Jail from "../screens/Jail";
import Junkies from "../screens/Junkies";
import Kill from "../screens/Kill";
import Login from "../screens/Login";
import Lotto from "../screens/Lotto";
import ManageObject from "../screens/ManageObject";
import Market from "../screens/Market";
import Members from "../screens/Members";
import MollieComplete from "../screens/MollieComplete";
import More from "../screens/More";
import MyObjects from "../screens/MyObjects";
import MyProfile from "../screens/MyProfile";
import OC from "../screens/OC";
import Poker from "../screens/Poker";
import Police from "../screens/Police";
import Privacy from "../screens/Privacy";
import Prizes from "../screens/Prizes";
import Profile from "../screens/Profile";
import Properties from "../screens/Properties";
import ProtectionShop from "../screens/ProtectionShop";
import Racecars from "../screens/Racecars";
import RecoverPassword from "../screens/RecoverPassword";
import Reports from "../screens/Reports";
import Rob from "../screens/Rob";
import Robbery from "../screens/Robbery";
import Settings from "../screens/Settings";
import Shop from "../screens/Shop";
import SignupEmail from "../screens/SignupEmail";
import SignupEmail2 from "../screens/SignupEmail2";
import Sint from "../screens/Sint";
import Stats from "../screens/Stats";
import Status from "../screens/Status";
import StealCar from "../screens/StealCar";
import Streetrace from "../screens/Streetrace";
import SwissBank from "../screens/SwissBank";
import Theme from "../screens/Theme";
import VerifyPhone from "../screens/VerifyPhone";
import VerifyPhoneCode from "../screens/VerifyPhoneCode";
import VIP from "../screens/VIP";
import WeaponShop from "../screens/WeaponShop";
import Wiet from "../screens/Wiet";
import Work from "../screens/Work";

export const screens = {
  Stats,
  Channels,
  More,
  Profile,
  Members,
  Gangs,
  Prizes,
  Properties,
  Settings,
  Info,
  Police,
  VIP,
  AdminEmail,
  AdminUserWatch,
  AirplaneShop,
  Airport,
  AllAirport,
  AllBanks,
  AllBulletfactory,
  AllGang,
  AllGarage,
  AllStats,
  Backfire,
  Bank,
  Blocks,
  Bulletfactory,
  Bunker,
  Casino,
  ChangeName,
  ChangePassword,
  Channel,
  Chat,
  ChooseProfession,
  Code,
  Contribute,
  CreateOc,
  CreateRobbery,
  CreateStreetrace,
  Crimes,
  Detectives,
  Donate,
  DownloadApp,
  EstateAgent,
  ForgotPassword,
  Bomb,
  Forum,
  Gang,
  GangAchievements,
  GangBulletFactory,
  GangCreate,
  GangMissions,
  GangSettings,
  GangShop,
  Garage,
  GarageShop,
  Gym,
  Hackers,
  Hoeren,
  Hospital,
  House,
  Income,
  InfoGame,
  InfoRules,
  Jail,
  Junkies,
  Kill,
  Login,
  Lotto,
  ManageObject,
  Market,
  MollieComplete,
  MyObjects,
  MyProfile,
  OC,
  Poker,
  Privacy,
  ProtectionShop,
  Racecars,
  RecoverPassword,
  Reports,
  Rob,
  Robbery,
  Shop,
  SignupEmail,
  SignupEmail2,
  Sint,
  Status,
  StealCar,
  SwissBank,
  Theme,
  Streetrace,
  VerifyPhone,
  VerifyPhoneCode,
  WeaponShop,
  Wiet,
  Work,
};

const Screen = ({ navigation, screenProps }) => {
  const screen = navigation.state.routeName;

  const Component = screens[screen];
  return <Component navigation={navigation} screenProps={screenProps} />;
};

export default Screen;
