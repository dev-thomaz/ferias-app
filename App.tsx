import "./src/styles/global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Routes } from "./src/navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Routes />
    </SafeAreaProvider>
  );
}
