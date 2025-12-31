import AsyncStorage from "@react-native-async-storage/async-storage";
import { Persistence } from "firebase/auth";

declare module "firebase/auth" {
  export function getReactNativePersistence(
    storage: typeof AsyncStorage
  ): Persistence;
}
