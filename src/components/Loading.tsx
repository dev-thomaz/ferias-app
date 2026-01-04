import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

const { height, width } = Dimensions.get("window");

export function Loading() {
  return (
    <View style={styles.container}>
      <StatusBar
        style="light"
        translucent={true}
        backgroundColor="transparent"
      />

      <Image
        source={require("../../assets/spinner.gif")}
        style={styles.spinner}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: height + 50,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3093E1",
    zIndex: 9999,
  },
  spinner: {
    width: 128,
    height: 128,
    marginBottom: 50,
  },
});
