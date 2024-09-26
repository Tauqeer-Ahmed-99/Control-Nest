import { Href } from "expo-router";

export enum Routes {
  Main = "index",
  Auth = "auth",
  Home = "home",
  HouseLogin = "house-login",
  Room = "room/[roomId]",
  Rooms = "rooms",
  Device = "room/[roomId]/[deviceId]",
  Devices = "devices",
  Notifications = "notifications",
  Settings = "settings",
}

export enum ApiRoutes {
  HouseMember = "/get-house-member",
  UserHouse = "/get-house",
  HouseLogin = "/house-login",
  SwitchDevice = "/switch-device",
  ConfigureDevice = "/configure-device",
  AddRoom = "/add-room",
  RemoveRoom = "/remove-room",
  AddDevice = "/add-device",
  RemoveDevice = "/remove-device",
  AvailableGPIOPins = "/get-available-gpio-pins",
}

export interface Route {
  path: Routes;
  label: string;
  showheader?: boolean;
}

const routes: Route[] = [
  { path: Routes.Main, label: "Home" },
  { path: Routes.Auth, label: "Authentication", showheader: true },
  { path: Routes.Home, label: "Home", showheader: true },
  { path: Routes.HouseLogin, label: "Login to House", showheader: true },
  { path: Routes.Room, label: "Room", showheader: true },
  { path: Routes.Rooms, label: "Rooms", showheader: true },
  { path: Routes.Device, label: "Device", showheader: true },
  { path: Routes.Devices, label: "Devices", showheader: true },
  { path: Routes.Notifications, label: "Notifications", showheader: true },
  { path: Routes.Settings, label: "Settings", showheader: true },
];

export const getTypedRoute = <T>(route: T) =>
  route as unknown as Href<Routes | string>;

export default routes;
