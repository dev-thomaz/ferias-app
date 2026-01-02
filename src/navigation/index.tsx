import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/config/firebase";
import { useAuthStore } from "../features/auth/store/useAuthStore";

import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { HomeScreen } from "../features/vacations/screens/Home/index";
import { NewVacationScreen } from "../features/vacations/screens/NewVacationScreen";
import { VacationDetailsScreen } from "../features/vacations/screens/VacationDetails/index";
import { UserApprovalScreen } from "../features/admin/screens/UserApprovalScreen";
import { AllVacationsScreen } from "@/features/admin/screens/AllVacationsScreen";
import { EmployeesListScreen } from "../features/admin/screens/EmployeesListScreen";

const Stack = createNativeStackNavigator();

export function Routes() {
  const { isAuthenticated, user, setUser, logout } = useAuthStore();
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          if (user?.id === firebaseUser.uid && user?.avatarID !== undefined) {
            setLoadingCheck(false);
            return;
          }

          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();

            if (userData.accountStatus !== "ACTIVE") {
              logout();
              setLoadingCheck(false);
              return;
            }

            setUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || "Usuário",
              email: firebaseUser.email!,
              role: userData.role,
              avatarID: userData.avatarID,
            });
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("Erro ao sincronizar usuário:", error);
        logout();
      } finally {
        setLoadingCheck(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loadingCheck) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />

            <Stack.Screen
              name="NewVacation"
              component={NewVacationScreen}
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />

            <Stack.Screen
              name="VacationDetails"
              component={VacationDetailsScreen}
              options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
              name="UserApproval"
              component={UserApprovalScreen}
              options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
              name="AllVacations"
              component={AllVacationsScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="EmployeesList"
              component={EmployeesListScreen}
              options={{ animation: "slide_from_right" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
