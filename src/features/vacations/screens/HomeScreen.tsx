import React from "react";
import { View, Text } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Button } from "../../../components/Button";

export function HomeScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View className="flex-1 bg-background p-6 pt-16">
      <View className="flex-row justify-between items-center mb-10">
        <View>
          <Text className="text-gray-500">Bem-vindo,</Text>
          <Text className="text-2xl font-bold text-secondary">
            {user?.name}
          </Text>
        </View>

        <View className="w-20">
          <Button title="Sair" variant="danger" onPress={logout} />
        </View>
      </View>

      <View className="bg-surface p-8 rounded-3xl shadow-sm border border-gray-100 items-center">
        <Text className="text-gray-400 text-center text-lg">
          Você ainda não possui solicitações de férias.
        </Text>
      </View>
    </View>
  );
}
