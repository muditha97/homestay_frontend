import React from "react";
import { View, Text } from "react-native";
import { LogBox } from "react-native";

import Navigation from "./src/navigation";

export default function App() {
  LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications
  return <Navigation />;
}
