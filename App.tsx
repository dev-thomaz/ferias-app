import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Routes } from "./src/navigation";

import "./src/styles/global.css";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        <Routes />
      </View>
    </GestureHandlerRootView>
  );
}
