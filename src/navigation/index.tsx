import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind";

import { authInstance } from "@/config/firebase";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { authService } from "../features/auth/services/authService";

import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { HomeScreen } from "../features/vacations/screens/Home/index";
import { NewVacationScreen } from "../features/vacations/screens/NewVacationScreen";
import { VacationDetailsScreen } from "../features/vacations/screens/VacationDetails/index";
import { UserApprovalScreen } from "../features/admin/screens/UserApprovalScreen";
import { AllVacationsScreen } from "@/features/admin/screens/AllVacationsScreen";
import { EmployeesListScreen } from "../features/admin/screens/EmployeesListScreen";

const Stack = createNativeStackNavigator();

export function Routes() {
  const { isAuthenticated, setUser, logout } = useAuthStore();
  const [loadingCheck, setLoadingCheck] = useState(true);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const subscriber = authInstance.onAuthStateChanged(async (nativeUser) => {
      try {
        if (nativeUser) {
          const userProfile = await authService.getUserProfile(nativeUser.uid);

          if (userProfile) {
            setUser(userProfile);
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("Erro na verificação de sessão:", error);
        logout();
      } finally {
        setLoadingCheck(false);
      }
    });

    return subscriber;
  }, []);

  if (loadingCheck) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colorScheme === "dark" ? "#0F172A" : "#F8FAFC",
        }}
      >
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="NewVacation"
              component={NewVacationScreen}
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="VacationDetails"
              component={VacationDetailsScreen}
            />
            <Stack.Screen name="UserApproval" component={UserApprovalScreen} />
            <Stack.Screen name="AllVacations" component={AllVacationsScreen} />
            <Stack.Screen
              name="EmployeesList"
              component={EmployeesListScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
