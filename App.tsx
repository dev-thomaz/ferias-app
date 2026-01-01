import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./src/config/firebase";
import { useAuthStore } from "./src/features/auth/store/useAuthStore";

import { Routes } from "./src/navigation";
import { StatusBar } from "expo-status-bar";

import "@/styles/global.css";

export default function App() {
  const { user, setUser } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (user?.id === firebaseUser.uid && user?.avatarID !== undefined) {
          setInitializing(false);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();

            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: userData.name,
              role: userData.role,

              avatarID: userData.avatarID,
            });
          }
        } catch (error) {
          console.log("Erro ao restaurar sessão:", error);
        }
      } else {
        setUser(null);
      }

      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Routes />
    </>
  );
}
