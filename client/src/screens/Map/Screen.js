import React from "react";
import Accomplice from "../Accomplice";
import AdminEmail from "../AdminEmail";
import AdminUserWatch from "../AdminUserWatch";
import AirplaneShop from "../AirplaneShop";
import Airport from "../Airport";
import AllAirport from "../AllAirport";
import AllBanks from "../AllBanks";
import AllBulletfactory from "../AllBulletfactory";
import AllGang from "../AllGang";
import AllGarage from "../AllGarage";
import AllStats from "../AllStats";
import Backfire from "../Backfire";
import Bank from "../Bank";
import Blocks from "../Blocks";
import Bomb from "../Bomb";
import Bulletfactory from "../Bulletfactory";
import Bunker from "../Bunker";
import Casino from "../Casino";
import ChangeName from "../ChangeName";
import ChangePassword from "../ChangePassword";
import Channel from "../Channel";
import Channels from "../Channels";
import Chat from "../Chat";
import ChooseProfession from "../ChooseProfession";
import Code from "../Code";
import Contribute from "../Contribute";
import CreateOc from "../CreateOC";
import CreateRobbery from "../CreateRobbery";
import CreateStreetrace from "../CreateStreetrace";
import Crimes from "../Crimes";
import Detectives from "../Detectives";
import Donate from "../Donate";
import DownloadApp from "../DownloadApp";
import EstateAgent from "../EstateAgent";
import ForgotPassword from "../ForgotPassword";
import Forum from "../Forum";
import Gang from "../Gang";
import GangAchievements from "../GangAchievements";
import GangBulletFactory from "../GangBulletFactory";
import GangCreate from "../GangCreate";
import GangMissions from "../GangMissions";
import Gangs from "../Gangs";
import GangSettings from "../GangSettings";
import GangShop from "../GangShop";
import Garage from "../Garage";
import GarageShop from "../GarageShop";
import Gym from "../Gym";
import Hackers from "../Hackers";
import Hoeren from "../Hoeren";
import Home from "../Home";
import Hospital from "../Hospital";
import House from "../House";
import Income from "../Income";
import Info from "../Info";
import InfoGame from "../InfoGame";
import InfoRules from "../InfoRules";
import Jail from "../Jail";
import Junkies from "../Junkies";
import Kill from "../Kill";
import Login from "../Login";
import Lotto from "../Lotto";
import ManageObject from "../ManageObject";
import Market from "../Market";
import Members from "../Members";
import MollieComplete from "../MollieComplete";
import More from "../More";
import MyObjects from "../MyObjects";
import MyProfile from "../MyProfile";
import OC from "../OC";
import Poker from "../Poker";
import Police from "../Police";
import Privacy from "../Privacy";
import Prizes from "../Prizes";
import Profile from "../Profile";
import Properties from "../Properties";
import ProtectionShop from "../ProtectionShop";
import Racecars from "../Racecars";
import RecoverPassword from "../RecoverPassword";
import Reports from "../Reports";
import Rob from "../Rob";
import Robbery from "../Robbery";
import Settings from "../Settings";
import Shop from "../Shop";
import SignupEmail from "../SignupEmail";
import SignupEmail2 from "../SignupEmail2";
import Sint from "../Sint";
import Stats from "../Stats";
import Status from "../Status";
import StealCar from "../StealCar";
import Streetrace from "../Streetrace";
import SwissBank from "../SwissBank";
import Theme from "../Theme";
import VerifyPhone from "../VerifyPhone";
import VerifyPhoneCode from "../VerifyPhoneCode";
import VIP from "../VIP";
import WeaponShop from "../WeaponShop";
import Wiet from "../Wiet";
import Work from "../Work";

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
  Accomplice,
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
  Home,
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
