import React from "react";
import { View, TouchableOpacity, Text, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { VacationRequest } from "../../types";

import { ManagerView } from "./ManagerView";
import { EmployeeView } from "./EmployeeView";

export function VacationDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuthStore();

  const { request } = route.params as {
    request: VacationRequest & { id: string };
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="pt-12 px-6 pb-4 bg-white shadow-sm border-b border-gray-100 z-10 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2 rounded-full active:bg-gray-100"
        >
          <Feather name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-2">
          Detalhes da Solicitação
        </Text>
      </View>

      {user?.role === "GESTOR" ? (
        <ManagerView request={request} user={user} />
      ) : (
        <EmployeeView request={request} />
      )}
    </View>
  );
}
