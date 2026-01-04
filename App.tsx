import React, { useCallback, useEffect, useState } from "react";
import { View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { Routes } from "./src/navigation";

import "./src/styles/global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#3093E1",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("./assets/logo.png")}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#3093E1" }}
      onLayout={onLayoutRootView}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Routes />
      </GestureHandlerRootView>
    </View>
  );
}
