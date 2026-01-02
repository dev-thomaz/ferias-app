import React from "react";
import { View, TouchableOpacity, Text, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { VacationRequest } from "../../types";

import { ManagerView } from "./ManagerView";
import { EmployeeView } from "./EmployeeView";
import { AdminView } from "./AdminView";

export function VacationDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { request } = route.params as {
    request: VacationRequest & { id: string };
  };

  const renderContent = () => {
    switch (user?.role) {
      case "ADMIN":
        return <AdminView request={request} />;
      case "GESTOR":
        return <ManagerView request={request} user={user} />;
      case "COLABORADOR":
      default:
        return <EmployeeView request={request} />;
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <View className="pt-12 px-6 pb-4 bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-100 dark:border-gray-800 z-10 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
        >
          <Feather
            name="arrow-left"
            size={24}
            color={isDark ? "#F3F4F6" : "#374151"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-2">
          Detalhes da Solicitação
        </Text>
      </View>

      {renderContent()}
    </View>
  );
}
