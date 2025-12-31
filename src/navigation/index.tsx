import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../features/auth/store/useAuthStore";

import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { HomeScreen } from "../features/vacations/screens/HomeScreen";

import { NewVacationScreen } from "../features/vacations/screens/NewVacationScreen";

const Stack = createNativeStackNavigator();

export function Routes() {
  const { isAuthenticated } = useAuthStore();

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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
